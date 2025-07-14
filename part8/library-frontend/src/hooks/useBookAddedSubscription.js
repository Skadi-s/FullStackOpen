import { useEffect, useRef } from 'react'
import { gql, useSubscription, useApolloClient } from '@apollo/client'

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      id
      title
      author {
        name
        id
        born
      }
      published
      genres
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      id
      title
      author {
        name
        id
        born
      }
      published
      genres
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

export const ALL_BOOKS_FOR_GENRES = gql`
  query {
    allBooks {
      genres
    }
  }
`

export const useBookAddedSubscription = (onBookAdded = null) => {
  const client = useApolloClient()
  const { data, loading, error } = useSubscription(BOOK_ADDED)
  const processedBooksRef = useRef(new Set())

  useEffect(() => {
    if (data && data.bookAdded) {
      const book = data.bookAdded
      
      // 检查这本书是否已经处理过
      if (processedBooksRef.current.has(book.id)) {
        return
      }
      
      // 标记这本书已经处理过
      processedBooksRef.current.add(book.id)
      
      console.log('New book received:', book.title, 'with genres:', book.genres)
      
      // 强制重新获取所有相关查询
      client.refetchQueries({
        include: [ALL_BOOKS, ALL_BOOKS_FOR_GENRES, ALL_AUTHORS]
      })
      
      console.log('Cache refreshed for all book queries')
      
      // 更新 ALL_BOOKS 缓存（无过滤器）
      try {
        const existingBooksQuery = client.readQuery({ 
          query: ALL_BOOKS,
          variables: { genre: null }
        })
        if (existingBooksQuery) {
          const bookExists = existingBooksQuery.allBooks.some(b => b.id === book.id)
          if (!bookExists) {
            client.writeQuery({
              query: ALL_BOOKS,
              variables: { genre: null },
              data: {
                allBooks: [...existingBooksQuery.allBooks, book]
              }
            })
            console.log('Books cache (all) updated with new book:', book.title)
          }
        }
      } catch (e) {
        console.log('Books query (all) not in cache, will be fetched on next access')
      }

      // 更新 ALL_BOOKS 缓存（各种类型过滤器）
      book.genres.forEach(genre => {
        try {
          const existingBooksQuery = client.readQuery({ 
            query: ALL_BOOKS,
            variables: { genre: genre }
          })
          if (existingBooksQuery) {
            const bookExists = existingBooksQuery.allBooks.some(b => b.id === book.id)
            if (!bookExists) {
              client.writeQuery({
                query: ALL_BOOKS,
                variables: { genre: genre },
                data: {
                  allBooks: [...existingBooksQuery.allBooks, book]
                }
              })
              console.log(`Books cache (${genre}) updated with new book:`, book.title)
            }
          }
        } catch (e) {
          console.log(`Books query (${genre}) not in cache, will be fetched on next access`)
        }
      })

      // 更新 ALL_BOOKS_FOR_GENRES 缓存
      try {
        const existingGenresQuery = client.readQuery({ query: ALL_BOOKS_FOR_GENRES })
        if (existingGenresQuery) {
          // 检查是否需要添加新的书籍到类型查询
          const bookExists = existingGenresQuery.allBooks.some(b => b.id === book.id)
          if (!bookExists) {
            client.writeQuery({
              query: ALL_BOOKS_FOR_GENRES,
              data: {
                allBooks: [...existingGenresQuery.allBooks, { genres: book.genres }]
              }
            })
            console.log('Genres cache updated with new book genres:', book.genres)
          }
        }
      } catch (e) {
        console.log('Genres query not in cache, will be fetched on next access')
      }

      // 更新 ALL_AUTHORS 缓存
      try {
        const existingAuthorsQuery = client.readQuery({ query: ALL_AUTHORS })
        if (existingAuthorsQuery && book.author) {
          const authorExists = existingAuthorsQuery.allAuthors.some(a => a.id === book.author.id)
          let updatedAuthors
          
          if (!authorExists) {
            // 添加新作者
            const newAuthor = {
              ...book.author,
              bookCount: 1
            }
            updatedAuthors = [...existingAuthorsQuery.allAuthors, newAuthor]
            console.log('Added new author to cache:', book.author.name)
          } else {
            // 更新现有作者的书籍数量
            updatedAuthors = existingAuthorsQuery.allAuthors.map(author => 
              author.id === book.author.id 
                ? { ...author, bookCount: author.bookCount + 1 }
                : author
            )
            console.log('Updated author book count for:', book.author.name)
          }
          
          client.writeQuery({
            query: ALL_AUTHORS,
            data: {
              allAuthors: updatedAuthors
            }
          })
        }
      } catch (e) {
        console.log('Authors query not in cache, will be fetched on next access')
      }

      // 调用回调函数（如果提供）
      if (onBookAdded) {
        onBookAdded(book)
      }
    }
  }, [data, client, onBookAdded])

  return { data, loading, error }
}

export default useBookAddedSubscription

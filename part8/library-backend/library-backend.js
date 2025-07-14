const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { graphql } = require('graphql')
const gql = require('graphql-tag')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
require('dotenv').config()

const Author = require('./models/author')
const Book = require('./models/book')

console.log('connecting to', process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Data will now come from MongoDB database

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
    type Author {
        name: String!
        id: ID!
        born: Int
        bookCount: Int!
    }

    type Book {
        title: String!
        published: Int!
        author: Author!
        id: ID!
        genres: [String!]!
    }

    type Query {
        booksCount: Int!
        authorsCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
        findAuthor(name: String!): Author
        findBook(title: String!): Book
    }

    type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genres: [String!]!
        ): Book
        editAuthor(
            name: String!
            setBornTo: Int!
        ): Author
    }
`

const resolvers = {
  Query: {
    booksCount: async () => Book.collection.countDocuments(),
    authorsCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let filter = {}
      
      // 如果有作者筛选条件
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          filter.author = author._id
        } else {
          return [] // 如果作者不存在，返回空数组
        }
      }
      
      // 如果有类型筛选条件
      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }
      
      return Book.find(filter).populate('author')
    },
    allAuthors: async () => Author.find({}),
    findAuthor: async (root, args) => Author.findOne({ name: args.name }),
    findBook: async (root, args) => Book.findOne({ title: args.title }).populate('author')
  },
  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id })
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      try {
        // 查找或创建作者
        let author = await Author.findOne({ name: args.author })
        
        if (!author) {
          author = new Author({ name: args.author })
          await author.save()
        }
        
        // 创建新书籍
        const book = new Book({
          title: args.title,
          published: args.published,
          author: author._id,
          genres: args.genres
        })
        
        await book.save()
        return book.populate('author')
      } catch (error) {
        throw new Error(error.message)
      }
    },
    editAuthor: async (root, args) => {
      try {
        const author = await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo },
          { new: true }
        )
        
        return author
      } catch (error) {
        throw new Error(error.message)
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4001 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
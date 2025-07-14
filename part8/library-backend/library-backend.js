const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { graphql } = require('graphql')
const gql = require('graphql-tag')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { GraphQLError } = require('graphql')
require('dotenv').config()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

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
    type User {
        username: String!
        favouriteGenre: String!
        id: ID!
    }

    type Token {
        value: String!
    }

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
        me: User
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
        createUser(
            username: String!
            favouriteGenre: String!
        ): User
        login(
            username: String!
            password: String!
        ): Token
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
    findBook: async (root, args) => Book.findOne({ title: args.title }).populate('author'),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id })
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }

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
        if (error.name === 'ValidationError') {
          throw new GraphQLError('Validation failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error: error.message
            }
          })
        }
        throw new GraphQLError('Adding book failed', {
          extensions: {
            code: 'INTERNAL_ERROR',
            error: error.message
          }
        })
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }

      try {
        const author = await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo },
          { new: true, runValidators: true }
        )
        
        if (!author) {
          throw new GraphQLError('Author not found', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
            }
          })
        }
        
        return author
      } catch (error) {
        if (error.name === 'ValidationError') {
          throw new GraphQLError('Validation failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error: error.message
            }
          })
        }
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'INTERNAL_ERROR',
            error: error.message
          }
        })
      }
    },
    createUser: async (root, args) => {
      try {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash('defaultpassword', saltRounds)
        
        const user = new User({
          username: args.username,
          favouriteGenre: args.favouriteGenre,
          passwordHash
        })

        await user.save()
        return user
      } catch (error) {
        if (error.name === 'ValidationError') {
          throw new GraphQLError('Validation failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error: error.message
            }
          })
        }
        if (error.code === 11000) {
          throw new GraphQLError('Username must be unique', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
            }
          })
        }
        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: 'INTERNAL_ERROR',
            error: error.message
          }
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(args.password, user.passwordHash)

      if (!(user && passwordCorrect)) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4001 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
    return {}
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
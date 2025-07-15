const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')

const express = require('express')
const cors = require('cors')
const http = require('http')

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const typeDefs = require('./schema')
const { resolvers, pubsub } = require('./resolvers')
const User = require('./models/user')

console.log('connecting to', process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// 创建可执行的 schema
const schema = makeExecutableSchema({ typeDefs, resolvers })

// 创建 HTTP 服务器
const app = express()
const httpServer = http.createServer(app)

// 创建 WebSocket 服务器
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
})

// 手动关闭 WebSocket 服务器
const serverCleanup = useServer({ schema }, wsServer)

// 创建 Apollo Server
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          },
        }
      },
    },
  ],
})

// 启动服务器
const startServer = async () => {
  await server.start()
  
  app.use(
    '/graphql',
    cors({
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
          try {
            const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
          } catch (error) {
            return {}
          }
        }
        return {}
      },
    })
  )

  const PORT = process.env.PORT || 4567
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql`)
  })
}

startServer().catch((error) => {
  console.error('Error starting server:', error)
})
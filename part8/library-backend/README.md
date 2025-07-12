# Library Backend

GraphQL backend for a library application built with Apollo Server.

## Features

- GraphQL API for managing books and authors
- Apollo Server with standalone setup
- In-memory data storage

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

The server will be available at http://localhost:4000

## GraphQL Playground

Access the GraphQL Playground at http://localhost:4000 to test your queries and mutations.

## Project Structure

- `library-backend.js` - Main server file with GraphQL schema and resolvers
- Sample data for books and authors included

## Dependencies

- @apollo/server - GraphQL server
- graphql - GraphQL implementation

## Dev Dependencies

- nodemon - Development server with auto-reload

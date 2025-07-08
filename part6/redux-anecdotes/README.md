# Redux Anecdotes App

A React application for managing programming anecdotes using Redux for UI state management and React Query for server state management.

## Features

- **View Anecdotes**: Browse a collection of programming anecdotes sorted by votes
- **Vote on Anecdotes**: Click to vote for your favorite anecdotes
- **Add New Anecdotes**: Submit new programming anecdotes to the collection
- **Filter Anecdotes**: Search through anecdotes with real-time filtering
- **Notifications**: Receive feedback for actions with auto-dismissing messages

## Architecture

This application demonstrates a hybrid state management approach:

- **Redux**: Manages UI state (notifications and filters)
- **React Query**: Handles server state (anecdotes data fetching, caching, and mutations)
- **JSON Server**: Provides a REST API backend for anecdote persistence

## Tech Stack

- **Frontend**: React 18, Vite
- **State Management**: Redux Toolkit, React Query
- **Backend**: JSON Server
- **Styling**: CSS
- **Development Tools**: React Query DevTools, Redux DevTools

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the JSON server (backend):
```bash
npm run server
```

3. Start the development server (frontend):
```bash
npm run dev
```

The application will be available at `http://localhost:5173` and the backend at `http://localhost:3001`.

## Project Structure

```
src/
├── components/
│   ├── AnecdoteFormQuery.jsx    # Form for creating anecdotes (React Query)
│   ├── AnecdoteListQuery.jsx    # List and voting for anecdotes (React Query)
│   ├── Filter.jsx               # Search filter component
│   └── Notification.jsx         # Notification display component
├── reducers/
│   ├── anecdoteReducer.js      # Redux slice for anecdotes (legacy)
│   ├── filterReducer.js        # Redux slice for filter state
│   └── notificationReducer.js  # Redux slice for notifications
├── services/
│   └── anecdotes.js            # API service functions
├── App.jsx                     # Main application component
├── main.jsx                    # Application entry point
└── store.js                    # Redux store configuration
```

## Key Features Implemented

### React Query Integration
- **Data Fetching**: Automatic background refetching and caching
- **Mutations**: Optimistic updates for voting and creating anecdotes
- **Error Handling**: Built-in error states and retry mechanisms
- **DevTools**: React Query DevTools for debugging

### Redux for UI State
- **Notifications**: Centralized notification system with auto-dismiss
- **Filtering**: Real-time search functionality
- **Redux Toolkit**: Modern Redux patterns with createSlice

### Backend Integration
- **JSON Server**: RESTful API with file-based persistence
- **CRUD Operations**: Create, read, update operations for anecdotes
- **Persistent Storage**: Anecdotes saved to `db.json` file

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run server` - Start JSON server backend

## Development Notes

This project was built as part of the Full Stack Open course, demonstrating:
- Migration from pure Redux to hybrid Redux + React Query architecture
- Separation of concerns between UI state and server state
- Modern React patterns and best practices
- Integration of multiple state management solutions

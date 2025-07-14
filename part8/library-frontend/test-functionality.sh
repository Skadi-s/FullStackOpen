#!/bin/bash

echo "=== Library App Testing Script ==="
echo

echo "1. Testing backend connection..."
response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"query":"query { booksCount }"}' http://localhost:4567/)
echo "Books count: $response"
echo

echo "2. Testing genre filtering..."
response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"query":"query { allBooks(genre: \"refactoring\") { title } }"}' http://localhost:4567/)
echo "Refactoring books: $response"
echo

echo "3. Testing all genres availability..."
response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"query":"query { allBooks { genres } }"}' http://localhost:4567/)
echo "All genres: $response"
echo

echo "4. Frontend is running at: http://localhost:5174"
echo "5. Backend is running at: http://localhost:4567"
echo

echo "=== Manual Testing Instructions ==="
echo "1. Open http://localhost:5174"
echo "2. Click 'books' to see genre filtering"
echo "3. Click 'login' and use: testuser / defaultpassword"
echo "4. After login, click 'recommend' to see personalized recommendations"

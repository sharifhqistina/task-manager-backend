#!/bin/bash

# Print a friendly message to the terminal
echo "🚀 Starting Task Manager Deployment..."

# Stop and remove any older versions of the containers
echo "Cleaning up old containers..."
docker-compose down

# Build the new images and start the containers in the background (-d)
echo "Building and starting new containers..."
docker-compose up --build -d

echo "✅ Deployment Successful!"
echo "➡️  Frontend is running at: http://localhost"
echo "➡️  Backend API is running at: http://localhost:5000"

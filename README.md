# Minor Project

## Overview

This project is a prescription management system with user authentication, profile management, and notification features.

## Setup

### Backend

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the backend directory with the following content:
   ```env
   MONGODB_URI=mongodb://localhost:27017/pill_reminder
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the frontend directory with the following content:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```
4. Start the frontend application:
   ```sh
   npm start
   ```

## Usage

- Access the frontend application at `http://localhost:3000`.
- Use the provided routes to navigate through the application and test the features.
````

### /d:/Karthik/RVCE/Sem 7/Minor Project/New folder/.gitignore

<file>
```gitignore
// filepath: /d:/Karthik/RVCE/Sem 7/Minor Project/New folder/.gitignore
# Node modules
node_modules/

# Environment variables
.env

# Logs
logs/
*.log

# Build output
frontend/build/

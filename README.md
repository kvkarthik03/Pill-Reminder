# Medical Prescription Management System

A web application for managing medical prescriptions and medication reminders.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/medical-prescriptions
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

## Accessing the Application

- Frontend: Open your browser and visit `http://localhost:3000`
- Backend API: Available at `http://localhost:5000`

## Default User Credentials

```
Patient:
Email: patient@example.com
Password: password123

Doctor:
Email: doctor@example.com
Password: password123
```

## Available Scripts

In both frontend and backend directories:

- `npm start` - Runs the application in development mode
- `npm test` - Runs the test suite
- `npm run build` - Builds the application for production

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT

## Additional Notes

- Make sure MongoDB is running before starting the backend server
- The backend API documentation is available at `http://localhost:5000/api-docs`
- For development, both frontend and backend servers need to be running simultaneously

# Medical Prescription Management System

A web application for managing prescriptions and medications, featuring an AI-powered medical assistant.

## Features

- **For Patients**
  - View and track prescriptions
  - Get medication reminders
  - Chat with AI medical assistant
  - Check drug interactions

- **For Doctors**
  - Create prescriptions
  - Monitor patient adherence
  - Manage patient records

## Setup Guide

### Prerequisites
1. Node.js (v14 or higher) - [Download](https://nodejs.org/)
2. MongoDB (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
3. Google Gemini API key - [Get here](https://makersuite.google.com/)
4. Git - [Download](https://git-scm.com/downloads)

### Step-by-Step Setup

1. **Clone the Repository**
```bash
git clone [repository-url]
cd [project-folder]
```

2. **Set Up MongoDB**
```bash
# Windows: Start MongoDB service
net start MongoDB

# Linux/Mac
sudo systemctl start mongod

# Verify MongoDB is running
mongosh
# You should see a MongoDB shell. Type 'exit' to close
```

3. **Backend Setup**
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=mongodb://127.0.0.1:27017/pill_reminder
JWT_SECRET=your_secret_key_here
PORT=5000
GEMINI_KEY_PERSONAL=your_gemini_api_key_here" > .env

# Start backend server
npm run dev
```

4. **Frontend Setup**
```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000" > .env

# Start frontend server
npm start
```

5. **Verify Setup**
- Backend should show: "Server running on port 5000"
- Frontend should open: http://localhost:3000
- MongoDB should be connected

### Login & Test
1. Open http://localhost:3000 in your browser
2. Log in using either:
```
Patient Account:
Email: patient@example.com
Password: password123

Doctor Account:
Email: doctor@example.com
Password: password123
```
3. Try creating a prescription (Doctor account)
4. Check the chatbot functionality (Patient account)

### Troubleshooting

1. **MongoDB Connection Error**
```bash
# Check if MongoDB is running
# Windows
services.msc   # Look for MongoDB service

# Linux/Mac
sudo systemctl status mongod
```

2. **Port Already in Use**
```bash
# Windows
netstat -ano | findstr :5000   # For backend
netstat -ano | findstr :3000   # For frontend

# Linux/Mac
lsof -i :5000   # For backend
lsof -i :3000   # For frontend
```

3. **Node Modules Issues**
```bash
# In both frontend and backend folders:
rm -rf node_modules
rm package-lock.json
npm install
```

### Development Tips
- Backend logs are in the terminal running the backend server
- Frontend logs are in the browser console (F12)
- MongoDB data can be viewed using MongoDB Compass

## Tech Stack
- Frontend: React.js
- Backend: Node.js, Express
- Database: MongoDB
- AI: Google Gemini

## Note
This is an educational project. Not for real medical use.

Need help? Create an issue in the repository.

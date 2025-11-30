# Quick Start Guide

## Current Status
✅ Backend dependencies installed
✅ Frontend dependencies installed
✅ Environment files created (.env)

## Next Steps to Run the Application

### 1. Install MongoDB

**Option A: Install MongoDB Community Edition (Recommended)**

Download and install MongoDB from: https://www.mongodb.com/try/download/community

1. Download MongoDB Community Server for Windows
2. Run the installer (choose "Complete" installation)
3. Install MongoDB as a Windows Service (recommended)
4. MongoDB Compass will be installed as well (optional GUI tool)

**Option B: Use MongoDB Atlas (Cloud Database - Free Tier)**

If you prefer not to install MongoDB locally:

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Update the `MONGODB_URI` in `backend/.env` with your Atlas connection string

### 2. Start MongoDB (if installed locally)

MongoDB should start automatically as a Windows Service. To verify:

```powershell
Get-Service -Name MongoDB
```

If not running, start it:

```powershell
Start-Service -Name MongoDB
```

Or manually start MongoDB:

```powershell
mongod
```

### 3. Seed the Database (Optional but Recommended)

This will create sample users and attendance data:

```powershell
cd D:\TapAcademy\employee-attendance-system\backend
npm run seed
```

**Sample Login Credentials:**

Manager:
- Email: manager@company.com
- Password: password123

Employees (all use password123):
- alice@company.com (EMP002 - Engineering)
- bob@company.com (EMP003 - Engineering)
- carol@company.com (EMP004 - Marketing)
- david@company.com (EMP005 - HR)
- eva@company.com (EMP006 - Engineering)

### 4. Start the Backend Server

Open a terminal and run:

```powershell
cd D:\TapAcademy\employee-attendance-system\backend
npm run dev
```

The backend will start on http://localhost:5000

### 5. Start the Frontend Application

Open another terminal and run:

```powershell
cd D:\TapAcademy\employee-attendance-system\frontend
npm start
```

The frontend will start on http://localhost:3000 and open automatically in your browser.

### 6. Access the Application

Open http://localhost:3000 in your browser and:
- Register a new account OR
- Use sample credentials from step 3 (if you seeded the database)

## Troubleshooting

### MongoDB Connection Error

If you see "MongoDB connection error":
1. Make sure MongoDB service is running
2. Check the `MONGODB_URI` in `backend/.env` is correct
3. Default: `mongodb://localhost:27017/attendance-system`

### Port Already in Use

**Backend (5000):**
Change PORT in `backend/.env`:
```
PORT=5001
```

**Frontend (3000):**
Set custom port:
```powershell
$env:PORT=3001; npm start
```

### Missing Dependencies

If you see module errors:
```powershell
cd backend
npm install

cd frontend
npm install
```

## Project Structure

```
employee-attendance-system/
├── backend/          # Node.js + Express API
│   ├── config/       # Database configuration
│   ├── models/       # User & Attendance models
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth middleware
│   ├── utils/        # Seed script
│   └── server.js     # Entry point
├── frontend/         # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── store/        # Redux store & slices
│   │   └── utils/        # API utilities
│   └── public/
└── README.md         # Detailed documentation
```

## Features Overview

### Employee Features
- ✅ Register/Login
- ✅ Mark Attendance (Check In/Out)
- ✅ View Attendance History (Calendar & Table view)
- ✅ Monthly Summary
- ✅ Dashboard with stats

### Manager Features
- ✅ Login
- ✅ View All Employees Attendance
- ✅ Filter by employee, date, status
- ✅ Team Calendar View
- ✅ Export Reports (CSV)
- ✅ Dashboard with charts

## API Endpoints

All endpoints are available at: http://localhost:5000/api

See README.md for complete API documentation.

## Support

For detailed documentation, see the main README.md file in the project root.

---

**Note:** Make sure MongoDB is running before starting the backend server!

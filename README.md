# Employee Attendance System

A full-stack web application for tracking employee attendance with separate dashboards for employees and managers.

## Tech Stack

- **Frontend**: React + Redux Toolkit
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Features

### Employee Features
1. Register/Login
2. Mark attendance (Check In / Check Out)
3. View attendance history (calendar or table view)
4. View monthly summary (Present/Absent/Late days)
5. Dashboard with stats

### Manager Features
1. Login
2. View all employees attendance
3. Filter by employee, date, status
4. View team attendance summary
5. Export attendance reports (CSV)
6. Dashboard with team stats

## Pages

### Employee Pages
- Login/Register
- Dashboard
- Mark Attendance
- My Attendance History
- Profile

### Manager Pages
- Login
- Dashboard
- All Employees Attendance
- Team Calendar View
- Reports

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd employee-attendance-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance-system
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup

Make sure MongoDB is running on your system. You can start MongoDB with:

```bash
mongod
```

### 5. Seed Database (Optional)

To populate the database with sample data:

```bash
cd backend
npm run seed
```

This will create:
- 1 Manager account
- 5 Employee accounts
- 30 days of attendance records for each employee

**Default Credentials:**

Manager:
- Email: manager@company.com
- Password: password123

Employees (all use password123):
- alice@company.com (EMP002 - Engineering)
- bob@company.com (EMP003 - Engineering)
- carol@company.com (EMP004 - Marketing)
- david@company.com (EMP005 - HR)
- eva@company.com (EMP006 - Engineering)

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on http://localhost:5000

### Start Frontend Application

```bash
cd frontend
npm start
```

The frontend application will start on http://localhost:3000

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Attendance (Employee)
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/my-history` - My attendance history
- `GET /api/attendance/my-summary` - Monthly summary
- `GET /api/attendance/today` - Today's status

### Attendance (Manager)
- `GET /api/attendance/all` - All employees attendance
- `GET /api/attendance/employee/:id` - Specific employee
- `GET /api/attendance/summary` - Team summary
- `GET /api/attendance/export` - Export CSV
- `GET /api/attendance/today-status` - Who's present today

### Dashboard
- `GET /api/dashboard/employee` - Employee stats
- `GET /api/dashboard/manager` - Manager stats

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (employee/manager),
  employeeId: String (unique, e.g., EMP001),
  department: String,
  createdAt: Date
}
```

### Attendance Collection
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  checkInTime: Date,
  checkOutTime: Date,
  status: String (present/absent/late/half-day),
  totalHours: Number,
  createdAt: Date
}
```

## Features Details

### Employee Dashboard
- Today's status (Checked In / Not Checked In)
- This month: X present, Y absent, Z late
- Total hours worked this month
- Recent attendance (last 7 days)
- Quick Check In/Out button

### Manager Dashboard
- Total employees
- Today's attendance: X present, Y absent
- Late arrivals today
- Chart: Weekly attendance trend
- Chart: Department-wise attendance
- List of absent employees today

### Attendance History (Employee)
- Calendar view showing present/absent/late days
- Color coding: Green (Present), Red (Absent), Yellow (Late), Orange (Half Day)
- Click on date to see details
- Filter by month

### Reports (Manager)
- Select date range
- Select employee or all
- Show table with attendance data
- Export to CSV button

## Color Coding

- **Green**: Present
- **Red**: Absent
- **Yellow**: Late (after 9:30 AM)
- **Orange**: Half Day (less than 4 hours)

## Attendance Rules

- Check-in after 9:30 AM is marked as "Late"
- Total hours less than 4 hours is marked as "Half Day"
- Employee can only check in once per day
- Employee must check in before checking out

## Screenshots

[Add screenshots of your application here]

## Project Structure

```
employee-attendance-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── attendance.js
│   │   └── dashboard.js
│   ├── utils/
│   │   └── seed.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Employee/
│   │   │   ├── Manager/
│   │   │   └── Layout/
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   └── store.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Check if the MongoDB URI in `.env` is correct

### Port Already in Use
- Backend: Change PORT in backend/.env
- Frontend: Change port using `PORT=3001 npm start`

### CORS Issues
- Make sure backend CORS is configured to allow frontend origin
- Check if API_URL in frontend/.env is correct

## Development

To run in development mode with hot reload:

Backend:
```bash
npm run dev
```

Frontend:
```bash
npm start
```

## Production Build

Frontend:
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `build` folder.

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Author

**Name:** Amruta Salagare  
**College:** ATME College of Engineering, Mysore  
**Contact:** 9008008973

---

**Note**: This is a demonstration project. For production use, implement additional security measures, input validation, and error handling.

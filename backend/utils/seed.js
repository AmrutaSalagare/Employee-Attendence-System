const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

dotenv.config();

const users = [
  {
    name: 'John Manager',
    email: 'manager@company.com',
    password: 'password123',
    role: 'manager',
    employeeId: 'EMP001',
    department: 'Management'
  },
  {
    name: 'Alice Johnson',
    email: 'alice@company.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP002',
    department: 'Engineering'
  },
  {
    name: 'Bob Smith',
    email: 'bob@company.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP003',
    department: 'Engineering'
  },
  {
    name: 'Carol Williams',
    email: 'carol@company.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP004',
    department: 'Marketing'
  },
  {
    name: 'David Brown',
    email: 'david@company.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP005',
    department: 'HR'
  },
  {
    name: 'Eva Davis',
    email: 'eva@company.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP006',
    department: 'Engineering'
  }
];

const generateAttendance = (userId, daysBack) => {
  const attendance = [];
  const today = new Date();
  
  for (let i = 0; i < daysBack; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // Random attendance pattern (80% present, 10% late, 5% absent, 5% half-day)
    const rand = Math.random();
    let status, checkInTime, checkOutTime, totalHours;
    
    if (rand < 0.05) {
      // Absent
      status = 'absent';
      checkInTime = null;
      checkOutTime = null;
      totalHours = 0;
    } else if (rand < 0.10) {
      // Half day
      status = 'half-day';
      checkInTime = new Date(date);
      checkInTime.setHours(9, Math.floor(Math.random() * 30), 0);
      checkOutTime = new Date(checkInTime);
      checkOutTime.setHours(checkOutTime.getHours() + 3, Math.floor(Math.random() * 60));
      totalHours = 3 + Math.random();
    } else if (rand < 0.20) {
      // Late
      status = 'late';
      checkInTime = new Date(date);
      checkInTime.setHours(10, Math.floor(Math.random() * 60), 0);
      checkOutTime = new Date(checkInTime);
      checkOutTime.setHours(18, Math.floor(Math.random() * 60));
      totalHours = 8 + Math.random();
    } else {
      // Present
      status = 'present';
      checkInTime = new Date(date);
      checkInTime.setHours(9, Math.floor(Math.random() * 20), 0);
      checkOutTime = new Date(checkInTime);
      checkOutTime.setHours(18, Math.floor(Math.random() * 60));
      totalHours = 8 + Math.random() * 2;
    }
    
    attendance.push({
      userId,
      date,
      checkInTime,
      checkOutTime,
      status,
      totalHours: Math.round(totalHours * 100) / 100
    });
  }
  
  return attendance;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log('Users created:', createdUsers.length);

    // Create attendance records for employees (not manager)
    const attendanceRecords = [];
    createdUsers.forEach(user => {
      if (user.role === 'employee') {
        const userAttendance = generateAttendance(user._id, 30); // Last 30 days
        attendanceRecords.push(...userAttendance);
      }
    });

    await Attendance.insertMany(attendanceRecords);
    console.log('Attendance records created:', attendanceRecords.length);

    console.log('\n=== Seed Data Summary ===');
    console.log('Manager credentials:');
    console.log('  Email: manager@company.com');
    console.log('  Password: password123');
    console.log('\nEmployee credentials (all use password123):');
    createdUsers.filter(u => u.role === 'employee').forEach(u => {
      console.log(`  ${u.email} (${u.employeeId} - ${u.department})`);
    });
    console.log('\nDatabase seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

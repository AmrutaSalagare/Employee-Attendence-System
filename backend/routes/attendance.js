const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { auth, isManager } = require('../middleware/auth');
const { Parser } = require('json2csv');

// Helper function to calculate total hours
const calculateTotalHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.round((diff / (1000 * 60 * 60)) * 100) / 100; // Hours with 2 decimal places
};

// Helper function to determine status
const determineStatus = (checkInTime) => {
  const checkIn = new Date(checkInTime);
  const hours = checkIn.getHours();
  const minutes = checkIn.getMinutes();
  
  // Late if after 9:30 AM
  if (hours > 9 || (hours === 9 && minutes > 30)) {
    return 'late';
  }
  return 'present';
};

// Employee Routes

// Check In
router.post('/checkin', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    let attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    if (attendance && attendance.checkInTime) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const checkInTime = new Date();
    const status = determineStatus(checkInTime);

    if (attendance) {
      attendance.checkInTime = checkInTime;
      attendance.status = status;
    } else {
      attendance = new Attendance({
        userId: req.user._id,
        date: today,
        checkInTime,
        status
      });
    }

    await attendance.save();

    res.json({
      message: 'Checked in successfully',
      attendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check Out
router.post('/checkout', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    const checkOutTime = new Date();
    attendance.checkOutTime = checkOutTime;
    attendance.totalHours = calculateTotalHours(attendance.checkInTime, checkOutTime);

    // Update status to half-day if less than 4 hours
    if (attendance.totalHours < 4) {
      attendance.status = 'half-day';
    }

    await attendance.save();

    res.json({
      message: 'Checked out successfully',
      attendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get today's attendance status
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    res.json({
      attendance: attendance || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my attendance history
router.get('/my-history', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let query = { userId: req.user._id };
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      endDate.setHours(23, 59, 59, 999);
      
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });

    res.json({
      attendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get monthly summary
router.get('/my-summary', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const selectedMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const selectedYear = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0);
    endDate.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      userId: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0
    };

    attendance.forEach(record => {
      if (record.status === 'present') summary.present++;
      else if (record.status === 'absent') summary.absent++;
      else if (record.status === 'late') summary.late++;
      else if (record.status === 'half-day') summary.halfDay++;
      
      summary.totalHours += record.totalHours || 0;
    });

    summary.totalHours = Math.round(summary.totalHours * 100) / 100;

    res.json({
      summary,
      month: selectedMonth,
      year: selectedYear
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Manager Routes

// Get all employees attendance
router.get('/all', auth, isManager, async (req, res) => {
  try {
    const { startDate, endDate, employeeId, status } = req.query;
    
    let query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) {
        query.userId = user._id;
      }
    }
    
    if (status) {
      query.status = status;
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    res.json({
      attendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific employee attendance
router.get('/employee/:id', auth, isManager, async (req, res) => {
  try {
    const { month, year } = req.query;
    const employeeId = req.params.id;

    const user = await User.findOne({ employeeId });
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    let query = { userId: user._id };
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      endDate.setHours(23, 59, 59, 999);
      
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    res.json({
      employee: {
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        department: user.department
      },
      attendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get team summary
router.get('/summary', auth, isManager, async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const selectedMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const selectedYear = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0);
    endDate.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('userId', 'name employeeId department');

    const summary = {
      totalPresent: 0,
      totalAbsent: 0,
      totalLate: 0,
      totalHalfDay: 0,
      departmentWise: {}
    };

    attendance.forEach(record => {
      if (record.status === 'present') summary.totalPresent++;
      else if (record.status === 'absent') summary.totalAbsent++;
      else if (record.status === 'late') summary.totalLate++;
      else if (record.status === 'half-day') summary.totalHalfDay++;

      const dept = record.userId?.department;
      if (dept) {
        if (!summary.departmentWise[dept]) {
          summary.departmentWise[dept] = { present: 0, absent: 0, late: 0, halfDay: 0 };
        }
        if (record.status === 'present') summary.departmentWise[dept].present++;
        else if (record.status === 'absent') summary.departmentWise[dept].absent++;
        else if (record.status === 'late') summary.departmentWise[dept].late++;
        else if (record.status === 'half-day') summary.departmentWise[dept].halfDay++;
      }
    });

    res.json({
      summary,
      month: selectedMonth,
      year: selectedYear
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get today's status (who's present)
router.get('/today-status', auth, isManager, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({ date: today })
      .populate('userId', 'name email employeeId department');

    const allEmployees = await User.find({ role: 'employee' });
    
    const present = attendance.filter(a => a.status === 'present' || a.status === 'late');
    const late = attendance.filter(a => a.status === 'late');
    const absent = allEmployees.filter(emp => 
      !attendance.some(a => a.userId._id.toString() === emp._id.toString())
    );

    res.json({
      date: today,
      totalEmployees: allEmployees.length,
      present: present.length,
      absent: absent.length,
      late: late.length,
      presentEmployees: present.map(a => ({
        name: a.userId.name,
        employeeId: a.userId.employeeId,
        department: a.userId.department,
        checkInTime: a.checkInTime,
        status: a.status
      })),
      lateEmployees: late.map(a => ({
        name: a.userId.name,
        employeeId: a.userId.employeeId,
        department: a.userId.department,
        checkInTime: a.checkInTime
      })),
      absentEmployees: absent.map(emp => ({
        name: emp.name,
        employeeId: emp.employeeId,
        department: emp.department
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export attendance as CSV
router.get('/export', auth, isManager, async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    
    let query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) {
        query.userId = user._id;
      }
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    const data = attendance.map(record => ({
      EmployeeID: record.userId?.employeeId || 'N/A',
      Name: record.userId?.name || 'N/A',
      Department: record.userId?.department || 'N/A',
      Date: record.date.toLocaleDateString(),
      CheckIn: record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : 'N/A',
      CheckOut: record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : 'N/A',
      Status: record.status,
      TotalHours: record.totalHours || 0
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance-report.csv');
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

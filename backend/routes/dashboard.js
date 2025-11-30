const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { auth, isManager } = require('../middleware/auth');

// Employee Dashboard
router.get('/employee', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's attendance
    const todayAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    // Get current month stats
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const monthlyAttendance = await Attendance.find({
      userId: req.user._id,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    const monthlySummary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0
    };

    monthlyAttendance.forEach(record => {
      if (record.status === 'present') monthlySummary.present++;
      else if (record.status === 'absent') monthlySummary.absent++;
      else if (record.status === 'late') monthlySummary.late++;
      else if (record.status === 'half-day') monthlySummary.halfDay++;
      
      monthlySummary.totalHours += record.totalHours || 0;
    });

    monthlySummary.totalHours = Math.round(monthlySummary.totalHours * 100) / 100;

    // Get last 7 days attendance
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAttendance = await Attendance.find({
      userId: req.user._id,
      date: {
        $gte: sevenDaysAgo,
        $lte: today
      }
    }).sort({ date: -1 });

    res.json({
      todayStatus: todayAttendance ? {
        checkedIn: !!todayAttendance.checkInTime,
        checkedOut: !!todayAttendance.checkOutTime,
        checkInTime: todayAttendance.checkInTime,
        checkOutTime: todayAttendance.checkOutTime,
        status: todayAttendance.status,
        totalHours: todayAttendance.totalHours
      } : {
        checkedIn: false,
        checkedOut: false
      },
      monthlySummary,
      recentAttendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Manager Dashboard
router.get('/manager', auth, isManager, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total employees
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    // Today's attendance
    const todayAttendance = await Attendance.find({ date: today })
      .populate('userId', 'name email employeeId department');

    const todayPresent = todayAttendance.filter(a => 
      a.status === 'present' || a.status === 'late' || a.status === 'half-day'
    ).length;
    
    const todayAbsent = totalEmployees - todayPresent;
    
    const todayLate = todayAttendance.filter(a => a.status === 'late');

    // Get all employees to find who's absent
    const allEmployees = await User.find({ role: 'employee' });
    const absentEmployees = allEmployees.filter(emp => 
      !todayAttendance.some(a => a.userId._id.toString() === emp._id.toString())
    );

    // Weekly attendance trend (last 7 days)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyAttendance = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: sevenDaysAgo,
            $lte: today
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          present: {
            $sum: {
              $cond: [
                { $in: ['$status', ['present', 'late', 'half-day']] },
                1,
                0
              ]
            }
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Department-wise attendance (current month)
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const departmentAttendance = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $group: {
          _id: '$user.department',
          present: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
            }
          },
          late: {
            $sum: {
              $cond: [{ $eq: ['$status', 'late'] }, 1, 0]
            }
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
            }
          },
          halfDay: {
            $sum: {
              $cond: [{ $eq: ['$status', 'half-day'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json({
      totalEmployees,
      todayStats: {
        present: todayPresent,
        absent: todayAbsent,
        lateArrivals: todayLate.length
      },
      lateEmployeesToday: todayLate.map(a => ({
        name: a.userId.name,
        employeeId: a.userId.employeeId,
        department: a.userId.department,
        checkInTime: a.checkInTime
      })),
      absentEmployeesToday: absentEmployees.map(emp => ({
        name: emp.name,
        employeeId: emp.employeeId,
        department: emp.department
      })),
      weeklyTrend: weeklyAttendance,
      departmentWise: departmentAttendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

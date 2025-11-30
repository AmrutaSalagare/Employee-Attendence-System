import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getManagerDashboard } from '../../store/slices/dashboardSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { managerData, loading } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getManagerDashboard());
  }, [dispatch]);

  if (loading || !managerData) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const { totalEmployees, todayStats, lateEmployeesToday, absentEmployeesToday, weeklyTrend, departmentWise } = managerData;

  const COLORS = ['#27ae60', '#e74c3c', '#f39c12', '#3498db'];

  const departmentChartData = departmentWise.map(dept => ({
    name: dept._id,
    Present: dept.present,
    Late: dept.late,
    Absent: dept.absent
  }));

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>Manager Dashboard - Welcome, {user?.name}!</h2>

      {/* Top Stats */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <div className="stat-value">{totalEmployees}</div>
        </div>
        <div className="stat-card present">
          <h3>Present Today</h3>
          <div className="stat-value">{todayStats.present}</div>
        </div>
        <div className="stat-card absent">
          <h3>Absent Today</h3>
          <div className="stat-value">{todayStats.absent}</div>
        </div>
        <div className="stat-card late">
          <h3>Late Arrivals</h3>
          <div className="stat-value">{todayStats.lateArrivals}</div>
        </div>
      </div>

      {/* Late Employees Today */}
      {lateEmployeesToday.length > 0 && (
        <div className="card">
          <h3 className="card-header">Late Arrivals Today</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Check In Time</th>
                </tr>
              </thead>
              <tbody>
                {lateEmployeesToday.map((emp, index) => (
                  <tr key={index}>
                    <td>{emp.employeeId}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{new Date(emp.checkInTime).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Absent Employees Today */}
      {absentEmployeesToday.length > 0 && (
        <div className="card">
          <h3 className="card-header">Absent Employees Today</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {absentEmployeesToday.map((emp, index) => (
                  <tr key={index}>
                    <td>{emp.employeeId}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Team Attendance Summary */}
      {departmentWise.length > 0 && (
        <div className="card">
          <h3 className="card-header">Team Attendance Summary (This Month)</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Present</th>
                  <th>Late</th>
                  <th>Absent</th>
                  <th>Half Day</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {departmentWise.map((dept, index) => {
                  const total = dept.present + dept.late + dept.absent + dept.halfDay;
                  return (
                    <tr key={index}>
                      <td><strong>{dept._id}</strong></td>
                      <td><span className="status-badge present">{dept.present}</span></td>
                      <td><span className="status-badge late">{dept.late}</span></td>
                      <td><span className="status-badge absent">{dept.absent}</span></td>
                      <td><span className="status-badge half-day">{dept.halfDay}</span></td>
                      <td><strong>{total}</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Weekly Attendance Trend */}
      {weeklyTrend.length > 0 && (
        <div className="chart-container">
          <h3 className="card-header">Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#27ae60" name="Present" />
              <Bar dataKey="absent" fill="#e74c3c" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Department-wise Attendance */}
      {departmentChartData.length > 0 && (
        <div className="chart-container">
          <h3 className="card-header">Department-wise Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Present" fill="#27ae60" />
              <Bar dataKey="Late" fill="#f39c12" />
              <Bar dataKey="Absent" fill="#e74c3c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;

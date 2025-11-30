import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTodayStatus } from '../../store/slices/attendanceSlice';

const TeamCalendar = () => {
  const dispatch = useDispatch();
  const { todayStatus, loading } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(getTodayStatus());
  }, [dispatch]);

  if (loading || !todayStatus) {
    return <div className="loading">Loading...</div>;
  }

  const { date, totalEmployees, present, absent, late, presentEmployees, lateEmployees, absentEmployees } = todayStatus;

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>Team Calendar View</h2>

      <div className="card">
        <h3 className="card-header">Today's Attendance - {new Date(date).toLocaleDateString()}</h3>
        
        {/* Stats */}
        <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <h3>Total Employees</h3>
            <div className="stat-value">{totalEmployees}</div>
          </div>
          <div className="stat-card present">
            <h3>Present</h3>
            <div className="stat-value">{present}</div>
          </div>
          <div className="stat-card absent">
            <h3>Absent</h3>
            <div className="stat-value">{absent}</div>
          </div>
          <div className="stat-card late">
            <h3>Late</h3>
            <div className="stat-value">{late}</div>
          </div>
        </div>

        {/* Present Employees */}
        {presentEmployees.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#27ae60' }}>Present Employees ({presentEmployees.length})</h4>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Check In Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {presentEmployees.map((emp, index) => (
                    <tr key={index}>
                      <td>{emp.employeeId}</td>
                      <td>{emp.name}</td>
                      <td>{emp.department}</td>
                      <td>{new Date(emp.checkInTime).toLocaleTimeString()}</td>
                      <td>
                        <span className={`status-badge ${emp.status}`}>
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Late Employees */}
        {lateEmployees.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#f39c12' }}>Late Employees ({lateEmployees.length})</h4>
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
                  {lateEmployees.map((emp, index) => (
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

        {/* Absent Employees */}
        {absentEmployees.length > 0 && (
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#e74c3c' }}>Absent Employees ({absentEmployees.length})</h4>
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
                  {absentEmployees.map((emp, index) => (
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
      </div>
    </div>
  );
};

export default TeamCalendar;

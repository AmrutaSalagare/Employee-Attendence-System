import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeDashboard } from '../../store/slices/dashboardSlice';
import { checkIn, checkOut } from '../../store/slices/attendanceSlice';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { employeeData, loading } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getEmployeeDashboard());
  }, [dispatch]);

  const handleCheckIn = async () => {
    await dispatch(checkIn());
    dispatch(getEmployeeDashboard());
  };

  const handleCheckOut = async () => {
    await dispatch(checkOut());
    dispatch(getEmployeeDashboard());
  };

  if (loading || !employeeData) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const { todayStatus, monthlySummary, recentAttendance } = employeeData;

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>Welcome, {user?.name}!</h2>

      {/* Quick Check In/Out */}
      <div className="card">
        <h3 className="card-header">Today's Status</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {!todayStatus.checkedIn ? (
            <button onClick={handleCheckIn} className="btn btn-success">
              Check In
            </button>
          ) : !todayStatus.checkedOut ? (
            <>
              <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✓ Checked In at {new Date(todayStatus.checkInTime).toLocaleTimeString()}</span>
              <button onClick={handleCheckOut} className="btn btn-danger">
                Check Out
              </button>
            </>
          ) : (
            <div>
              <p style={{ color: '#27ae60', fontWeight: 'bold' }}>✓ Checked In at {new Date(todayStatus.checkInTime).toLocaleTimeString()}</p>
              <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>✓ Checked Out at {new Date(todayStatus.checkOutTime).toLocaleTimeString()}</p>
              <p>Total Hours: {todayStatus.totalHours?.toFixed(2) || 0} hrs</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Summary */}
      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>This Month Summary</h3>
      <div className="dashboard-grid">
        <div className="stat-card present">
          <h3>Present Days</h3>
          <div className="stat-value">{monthlySummary.present}</div>
        </div>
        <div className="stat-card absent">
          <h3>Absent Days</h3>
          <div className="stat-value">{monthlySummary.absent}</div>
        </div>
        <div className="stat-card late">
          <h3>Late Days</h3>
          <div className="stat-value">{monthlySummary.late}</div>
        </div>
        <div className="stat-card">
          <h3>Total Hours</h3>
          <div className="stat-value">{monthlySummary.totalHours}</div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="card">
        <h3 className="card-header">Recent Attendance (Last 7 Days)</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {recentAttendance.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No attendance records</td>
                </tr>
              ) : (
                recentAttendance.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</td>
                    <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                    <td>
                      <span className={`status-badge ${record.status}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>{record.totalHours?.toFixed(2) || 0} hrs</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTodayAttendance, checkIn, checkOut } from '../../store/slices/attendanceSlice';

const MarkAttendance = () => {
  const dispatch = useDispatch();
  const { todayAttendance, loading, error } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(getTodayAttendance());
  }, [dispatch]);

  const handleCheckIn = async () => {
    await dispatch(checkIn());
    dispatch(getTodayAttendance());
  };

  const handleCheckOut = async () => {
    await dispatch(checkOut());
    dispatch(getTodayAttendance());
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>Mark Attendance</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h3 className="card-header">{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</h3>

        {!todayAttendance || !todayAttendance.checkInTime ? (
          <div>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#7f8c8d' }}>
              You haven't checked in today
            </p>
            <button 
              onClick={handleCheckIn} 
              className="btn btn-success" 
              disabled={loading}
              style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}
            >
              {loading ? 'Checking In...' : 'Check In'}
            </button>
          </div>
        ) : !todayAttendance.checkOutTime ? (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '1.2rem', color: '#27ae60', fontWeight: 'bold' }}>
                ✓ Checked In
              </p>
              <p style={{ fontSize: '1rem', color: '#7f8c8d' }}>
                {new Date(todayAttendance.checkInTime).toLocaleTimeString()}
              </p>
              <p style={{ marginTop: '1rem' }}>
                <span className={`status-badge ${todayAttendance.status}`}>
                  {todayAttendance.status.toUpperCase()}
                </span>
              </p>
            </div>
            <button 
              onClick={handleCheckOut} 
              className="btn btn-danger" 
              disabled={loading}
              style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}
            >
              {loading ? 'Checking Out...' : 'Check Out'}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '1.2rem', color: '#27ae60', fontWeight: 'bold' }}>
                ✓ Attendance Marked
              </p>
              <div style={{ marginTop: '1rem', textAlign: 'left', maxWidth: '300px', margin: '1rem auto' }}>
                <p><strong>Check In:</strong> {new Date(todayAttendance.checkInTime).toLocaleTimeString()}</p>
                <p><strong>Check Out:</strong> {new Date(todayAttendance.checkOutTime).toLocaleTimeString()}</p>
                <p><strong>Total Hours:</strong> {todayAttendance.totalHours?.toFixed(2)} hrs</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status-badge ${todayAttendance.status}`}>
                    {todayAttendance.status.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
            <p style={{ color: '#7f8c8d' }}>You have completed your attendance for today</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;

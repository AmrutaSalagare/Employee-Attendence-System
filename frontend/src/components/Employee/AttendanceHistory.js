import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyHistory, getMySummary } from '../../store/slices/attendanceSlice';

const AttendanceHistory = () => {
  const dispatch = useDispatch();
  const { myHistory, mySummary, loading } = useSelector((state) => state.attendance);
  
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'table'
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    dispatch(getMyHistory({ month: selectedMonth, year: selectedYear }));
    dispatch(getMySummary({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const getAttendanceForDate = (day) => {
    const dateToFind = new Date(selectedYear, selectedMonth - 1, day);
    dateToFind.setHours(0, 0, 0, 0);
    
    return myHistory.find(record => {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === dateToFind.getTime();
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Day headers
    dayNames.forEach(name => {
      days.push(
        <div key={`header-${name}`} style={{ fontWeight: 'bold', padding: '0.5rem', textAlign: 'center' }}>
          {name}
        </div>
      );
    });

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const attendance = getAttendanceForDate(day);
      const isToday = day === currentDate.getDate() && 
                     selectedMonth === (currentDate.getMonth() + 1) && 
                     selectedYear === currentDate.getFullYear();
      
      let className = 'calendar-day';
      if (attendance) {
        className += ` ${attendance.status}`;
      }
      if (isToday) {
        className += ' today';
      }

      days.push(
        <div
          key={day}
          className={className}
          onClick={() => attendance && setSelectedDay({ day, attendance })}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>My Attendance History</h2>

      {/* Month/Year Selector */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2024, i, 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={currentDate.getFullYear() - 2 + i} value={currentDate.getFullYear() - 2 + i}>
                  {currentDate.getFullYear() - 2 + i}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className={`btn ${viewMode === 'calendar' ? 'btn-primary' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              Calendar
            </button>
            <button 
              className={`btn ${viewMode === 'table' ? 'btn-primary' : ''}`}
              onClick={() => setViewMode('table')}
            >
              Table
            </button>
          </div>
        </div>

        {/* Summary */}
        {mySummary && (
          <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card present">
              <h3>Present</h3>
              <div className="stat-value">{mySummary.present}</div>
            </div>
            <div className="stat-card absent">
              <h3>Absent</h3>
              <div className="stat-value">{mySummary.absent}</div>
            </div>
            <div className="stat-card late">
              <h3>Late</h3>
              <div className="stat-value">{mySummary.late}</div>
            </div>
            <div className="stat-card">
              <h3>Half Day</h3>
              <div className="stat-value">{mySummary.halfDay}</div>
            </div>
          </div>
        )}
      </div>

      {/* Calendar or Table View */}
      {viewMode === 'calendar' ? (
        <div className="card">
          <div className="calendar-grid">
            {renderCalendar()}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
            <span><span style={{ display: 'inline-block', width: '15px', height: '15px', backgroundColor: '#d4edda', marginRight: '5px' }}></span> Present</span>
            <span><span style={{ display: 'inline-block', width: '15px', height: '15px', backgroundColor: '#f8d7da', marginRight: '5px' }}></span> Absent</span>
            <span><span style={{ display: 'inline-block', width: '15px', height: '15px', backgroundColor: '#fff3cd', marginRight: '5px' }}></span> Late</span>
            <span><span style={{ display: 'inline-block', width: '15px', height: '15px', backgroundColor: '#ffe0b2', marginRight: '5px' }}></span> Half Day</span>
          </div>
        </div>
      ) : (
        <div className="card">
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
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td>
                  </tr>
                ) : myHistory.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>No attendance records</td>
                  </tr>
                ) : (
                  myHistory.map((record) => (
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
      )}

      {/* Selected Day Details Modal */}
      {selectedDay && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setSelectedDay(null)}>
          <div className="card" style={{ maxWidth: '400px', margin: '1rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="card-header">
              {new Date(selectedDay.attendance.date).toLocaleDateString()}
            </h3>
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Check In:</strong> {selectedDay.attendance.checkInTime ? new Date(selectedDay.attendance.checkInTime).toLocaleTimeString() : '-'}</p>
              <p><strong>Check Out:</strong> {selectedDay.attendance.checkOutTime ? new Date(selectedDay.attendance.checkOutTime).toLocaleTimeString() : '-'}</p>
              <p><strong>Total Hours:</strong> {selectedDay.attendance.totalHours?.toFixed(2) || 0} hrs</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`status-badge ${selectedDay.attendance.status}`}>
                  {selectedDay.attendance.status}
                </span>
              </p>
            </div>
            <button 
              onClick={() => setSelectedDay(null)} 
              className="btn btn-primary" 
              style={{ marginTop: '1rem', width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;

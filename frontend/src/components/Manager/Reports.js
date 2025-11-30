import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAttendance, exportAttendance } from '../../store/slices/attendanceSlice';

const Reports = () => {
  const dispatch = useDispatch();
  const { allAttendance, loading } = useSelector((state) => state.attendance);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    employeeId: ''
  });

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerateReport = () => {
    dispatch(getAllAttendance(filters));
  };

  const handleExportCSV = () => {
    dispatch(exportAttendance(filters));
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>Attendance Reports</h2>

      {/* Report Filters */}
      <div className="card">
        <h3 className="card-header">Report Configuration</h3>
        <div className="filters">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>Employee ID (Optional)</label>
            <input
              type="text"
              name="employeeId"
              placeholder="e.g., EMP001 or leave blank for all"
              value={filters.employeeId}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            onClick={handleGenerateReport} 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          <button 
            onClick={handleExportCSV} 
            className="btn btn-success"
            disabled={loading || allAttendance.length === 0}
          >
            Export to CSV
          </button>
        </div>
      </div>

      {/* Report Results */}
      {allAttendance.length > 0 && (
        <div className="card">
          <h3 className="card-header">Report Results ({allAttendance.length} records)</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {allAttendance.map((record) => (
                  <tr key={record._id}>
                    <td>{record.userId?.employeeId || 'N/A'}</td>
                    <td>{record.userId?.name || 'N/A'}</td>
                    <td>{record.userId?.department || 'N/A'}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && allAttendance.length === 0 && (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '2rem' }}>
            Configure date range and click "Generate Report" to view attendance data
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;

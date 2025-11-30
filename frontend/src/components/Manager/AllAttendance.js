import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAttendance } from '../../store/slices/attendanceSlice';

const AllAttendance = () => {
  const dispatch = useDispatch();
  const { allAttendance, loading } = useSelector((state) => state.attendance);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    employeeId: '',
    status: ''
  });

  useEffect(() => {
    dispatch(getAllAttendance(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      employeeId: '',
      status: ''
    });
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>All Employees Attendance</h2>

      {/* Filters */}
      <div className="card">
        <h3 className="card-header">Filters</h3>
        <div className="filters">
          <div>
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              placeholder="e.g., EMP001"
              value={filters.employeeId}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={handleClearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <h3 className="card-header">Attendance Records ({allAttendance.length})</h3>
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
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>Loading...</td>
                </tr>
              ) : allAttendance.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No attendance records found</td>
                </tr>
              ) : (
                allAttendance.map((record) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllAttendance;

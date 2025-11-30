import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isManager = user?.role === 'manager';

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>Attendance System</h1>
        <div className="navbar-menu">
          {user && (
            <>
              <Link to={isManager ? '/manager/dashboard' : '/employee/dashboard'}>
                Dashboard
              </Link>
              {!isManager && (
                <>
                  <Link to="/employee/mark-attendance">Mark Attendance</Link>
                  <Link to="/employee/history">History</Link>
                  <Link to="/employee/profile">Profile</Link>
                </>
              )}
              {isManager && (
                <>
                  <Link to="/manager/attendance">All Attendance</Link>
                  <Link to="/manager/calendar">Calendar</Link>
                  <Link to="/manager/reports">Reports</Link>
                </>
              )}
              <div className="navbar-user">
                <span>{user.name} ({user.employeeId})</span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

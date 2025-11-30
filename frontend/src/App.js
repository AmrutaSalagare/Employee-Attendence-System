import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';

// Layout
import Navbar from './components/Layout/Navbar';
import PrivateRoute from './components/Layout/PrivateRoute';

// Auth
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Employee
import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import MarkAttendance from './components/Employee/MarkAttendance';
import AttendanceHistory from './components/Employee/AttendanceHistory';
import Profile from './components/Employee/Profile';

// Manager
import ManagerDashboard from './components/Manager/ManagerDashboard';
import AllAttendance from './components/Manager/AllAttendance';
import TeamCalendar from './components/Manager/TeamCalendar';
import Reports from './components/Manager/Reports';

import './App.css';

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, user]);

  return (
    <Router>
      <div className="App">
        {token && <Navbar />}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={token ? <Navigate to={user?.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard'} /> : <Login />} />
          <Route path="/register" element={token ? <Navigate to={user?.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard'} /> : <Register />} />

          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <PrivateRoute>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee/mark-attendance"
            element={
              <PrivateRoute>
                <MarkAttendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee/history"
            element={
              <PrivateRoute>
                <AttendanceHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="/manager/dashboard"
            element={
              <PrivateRoute requireManager={true}>
                <ManagerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/manager/attendance"
            element={
              <PrivateRoute requireManager={true}>
                <AllAttendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/manager/calendar"
            element={
              <PrivateRoute requireManager={true}>
                <TeamCalendar />
              </PrivateRoute>
            }
          />
          <Route
            path="/manager/reports"
            element={
              <PrivateRoute requireManager={true}>
                <Reports />
              </PrivateRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to={token ? (user?.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard') : '/login'} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

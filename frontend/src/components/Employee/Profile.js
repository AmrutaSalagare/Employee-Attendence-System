import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>My Profile</h2>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Personal Information</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <strong>Name:</strong>
              <p style={{ marginTop: '0.25rem', color: '#7f8c8d' }}>{user.name}</p>
            </div>
            <div>
              <strong>Email:</strong>
              <p style={{ marginTop: '0.25rem', color: '#7f8c8d' }}>{user.email}</p>
            </div>
            <div>
              <strong>Employee ID:</strong>
              <p style={{ marginTop: '0.25rem', color: '#7f8c8d' }}>{user.employeeId}</p>
            </div>
            <div>
              <strong>Department:</strong>
              <p style={{ marginTop: '0.25rem', color: '#7f8c8d' }}>{user.department}</p>
            </div>
            <div>
              <strong>Role:</strong>
              <p style={{ marginTop: '0.25rem', color: '#7f8c8d' }}>
                <span className="status-badge present" style={{ textTransform: 'capitalize' }}>
                  {user.role}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

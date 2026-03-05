import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Bell } from 'lucide-react';

const FacultyHome = () => {
  const navigate = useNavigate();
  const { userName } = useOutletContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Leave request approved by HOD", time: "1 hr ago" },
    { id: 2, text: "New timetable schedule available", time: "3 hrs ago" },
    { id: 3, text: "Dept meeting at 2:00 PM tomorrow", time: "1 day ago" }
  ]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <div className="dashboard-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Dashboard Overview
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Welcome back, {userName}
          </p>
        </div>

        <div className="notification-wrapper" style={{ position: 'relative' }}>
          <button onClick={toggleNotifications} className="notification-icon-btn">
            <Bell size={24} color="var(--text-main)" />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <span>Notifications</span>
                <span style={{ fontSize: '0.8rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '12px' }}>{notifications.length} New</span>
              </div>
              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map(note => (
                    <div key={note.id} className="notification-item">
                      <div className="note-text">{note.text}</div>
                      <div className="note-time">{note.time}</div>
                    </div>
                  ))
                ) : (
                  <div className="notification-empty">All caught up!</div>
                )}
              </div>
              {notifications.length > 0 && (
                <button onClick={clearNotifications} className="clear-all-btn">
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="modern-card" onClick={() => navigate('/faculty/requests')} style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--warning)', cursor: 'pointer', transition: 'var(--transition)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)' }}>Pending Requests</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '0.5rem' }}>3 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Needed</span></div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '0.5rem 1rem', background: 'var(--warning-light)', color: 'var(--warning)', borderRadius: 'var(--radius-md)', fontWeight: 500 }}>Rescheduling Approvals</div>
          </div>
        </div>

        <div className="modern-card" onClick={() => navigate('/faculty/timetable')} style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--success)', cursor: 'pointer', transition: 'var(--transition)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)' }}>Weekly Workload</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.5rem' }}>16 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Hours</span></div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '0.5rem 1rem', background: 'var(--success)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 500 }}>4 Theory</div>
            <div style={{ padding: '0.5rem 1rem', background: 'var(--success)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 500, opacity: 0.8 }}>2 Labs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyHome;

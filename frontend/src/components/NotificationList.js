import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { playNotificationSound } from '../utils/sound';
import '../styles/NotificationList.css';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const previousNotificationsRef = useRef([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false; // Component cleanup
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      
      if (!mountedRef.current) return; // Don't update state if unmounted

      // Check for new unread notifications
      const newUnreadNotifications = data.filter(
        notification => !notification.read && 
        !previousNotificationsRef.current.find(
          prev => prev._id === notification._id
        )
      );

      // Play sound if there are new unread notifications
      if (newUnreadNotifications.length > 0) {
        playNotificationSound();
      }

      setNotifications(data);
      previousNotificationsRef.current = data;
      setError(null);
    } catch (err) {
      if (mountedRef.current) { // Only update state if mounted
        setError('Failed to load notifications');
        console.error('Error fetching notifications:', err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let intervalId;
    fetchNotifications();
    
    intervalId = setInterval(fetchNotifications, 30000);
    return () => {
      clearInterval(intervalId);
      mountedRef.current = false;
    };
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(notifications.map(notification =>
        notification._id === id ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <div className="notification-list">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification._id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-message">
                {notification.message}
              </div>
              {!notification.read && (
                <div className="notification-actions">
                  <button 
                    className="mark-read-btn"
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    Mark as Read
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList;

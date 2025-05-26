import React from 'react';
import { useNotification } from '../utils/NotificationContext';

const Notification = () => {
  const { notification, clearNotification } = useNotification();
  
  if (!notification) return null;
  
  const { message, type } = notification;
  
  const getAlertClass = () => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-danger';
      case 'warning':
        return 'alert-warning';
      default:
        return 'alert-info';
    }
  };
  
  return (
    <div className={`alert ${getAlertClass()} alert-dismissible fade show position-fixed top-0 end-0 m-3`} role="alert" style={{ zIndex: 1050 }}>
      {message}
      <button type="button" className="btn-close" onClick={clearNotification}></button>
    </div>
  );
};

export default Notification;

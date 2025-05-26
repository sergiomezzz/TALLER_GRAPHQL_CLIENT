import React, { createContext, useState, useCallback } from 'react';

// Crear el contexto de notificación
export const NotificationContext = createContext();

// Proveedor de notificación
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  
  // Función para mostrar una notificación
  const showNotification = useCallback((message, type = 'info', duration = 5000) => {
    setNotification({ message, type });
    
    // Limpiar la notificación después de la duración especificada
    setTimeout(() => {
      setNotification(null);
    }, duration);
  }, []);
  
  // Función para limpiar la notificación manualmente
  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);
  
  return (
    <NotificationContext.Provider value={{ 
      notification, 
      showNotification, 
      clearNotification 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook personalizado para usar el contexto de notificación
export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification debe ser usado dentro de un NotificationProvider');
  }
  return context;
};

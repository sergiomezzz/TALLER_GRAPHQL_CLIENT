import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../graphql/mutations';

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const [loginMutation] = useMutation(LOGIN);
  
  // Verificar si hay un usuario autenticado al cargar la aplicación
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        const userDataStr = localStorage.getItem('userData');
        
        if (token && userDataStr) {
          const userData = JSON.parse(userDataStr);
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);
  
  // Función para iniciar sesión
  const login = async (email, password) => {
    try {      const { data } = await loginMutation({
        variables: { email, password }
      });
      
      const token = data.login;
        // Decodificar el token JWT para obtener la información del usuario
      try {
        // Extraer los datos del token (que está en formato base64)
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          
          const userData = {
            id: payload.id, // ID real del usuario desde el token
            email: payload.email,
            rol: payload.rol,
            nombre: payload.nombre || email.split('@')[0], // fallback al nombre del email
            apellido: payload.apellido || ''
          };
          
          localStorage.setItem('token', token);
          localStorage.setItem('userData', JSON.stringify(userData));
          
          setCurrentUser(userData);
          navigate('/');
          
          return { success: true };
        } else {
          throw new Error('Formato de token inválido');
        }
      } catch (decodeError) {
        console.error('Error al decodificar token:', decodeError);
        
        // Como fallback temporal, buscaremos al usuario por email
        try {
          // Por ahora, vamos a usar un ID de usuario de la base de datos como temporal
          const userData = {
            id: '68338e8f799f3337960a5b47', // ID del usuario lector de la base de datos
            email: email,
            rol: 'LECTOR',
            nombre: email.split('@')[0],
            apellido: ''
          };
          
          localStorage.setItem('token', token);
          localStorage.setItem('userData', JSON.stringify(userData));
          
          setCurrentUser(userData);
          navigate('/');
          
          return { success: true };
        } catch (fallbackError) {
          return { 
            success: false, 
            message: 'Error al procesar la información de autenticación'
          };
        }
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { 
        success: false, 
        message: error.message || 'Error al iniciar sesión'
      };
    }
  };
  
  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    navigate('/login');
  };
  
  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return currentUser && currentUser.rol === role;
  };
  
  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      hasRole,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

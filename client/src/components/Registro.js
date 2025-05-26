import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REGISTRAR_USUARIO } from '../graphql/mutations';
import { useNotification } from '../utils/NotificationContext';

const Registro = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [registrarUsuario, { loading }] = useMutation(REGISTRAR_USUARIO, {
    onCompleted: () => {
      showNotification('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
      navigate('/login');
    },
    onError: (error) => {
      showNotification(error.message || 'Error al registrarse', 'error');
    }
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.password) {
      showNotification('Todos los campos son obligatorios', 'error');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      showNotification('Las contraseñas no coinciden', 'error');
      return;
    }
    
    if (formData.password.length < 6) {
      showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    
    // Registro de usuario
    registrarUsuario({
      variables: {
        usuario: {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
          rol: 'LECTOR' // Por defecto, todos los usuarios se registran como lectores
        }
      }
    });
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Registro de Usuario</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="apellido" className="form-label">Apellido</label>
                    <input
                      type="text"
                      className="form-control"
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <small className="form-text text-muted">
                    La contraseña debe tener al menos 6 caracteres.
                  </small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Procesando...
                      </>
                    ) : 'Registrarse'}
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-4">
                <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
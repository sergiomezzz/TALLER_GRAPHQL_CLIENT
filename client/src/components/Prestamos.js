import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_PRESTAMOS_USUARIO, GET_PRESTAMOS } from '../graphql/queries';
import { REGISTRAR_DEVOLUCION } from '../graphql/mutations';
import { useAuth } from '../utils/AuthContext';
import { useNotification } from '../utils/NotificationContext';

const Prestamos = () => {
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);
  
  // Definir las consultas y mutaciones fuera de cualquier condicional
  const { loading, error, data, refetch } = useQuery(
    currentUser?.rol === 'ADMINISTRADOR' ? GET_PRESTAMOS : GET_PRESTAMOS_USUARIO,
    {
      variables: currentUser?.rol !== 'ADMINISTRADOR' ? { usuarioId: currentUser?.id } : undefined,
      fetchPolicy: 'cache-and-network',
      skip: !currentUser // Skip the query if there's no user
    }
  );
  
  const [registrarDevolucion, { loading: loadingDevolucion }] = useMutation(REGISTRAR_DEVOLUCION, {
    onCompleted: () => {
      showNotification('Devolución registrada correctamente', 'success');
      setSelectedPrestamo(null);
      refetch();
    },
    onError: (error) => {
      showNotification(`Error al registrar la devolución: ${error.message}`, 'error');
    }
  });
  
  const handleDevolucion = (prestamoId) => {
    if (loadingDevolucion) return;
    
    registrarDevolucion({
      variables: { prestamoId }
    });
  };
  
  if (!currentUser) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Debes iniciar sesión para ver tus préstamos.
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(parseInt(dateString));
    return date.toLocaleDateString();
  };
  
  return (
    <div className="container py-5">
      <h1 className="mb-4">
        {currentUser.rol === 'ADMINISTRADOR' ? 'Gestión de Préstamos' : 'Mis Préstamos'}
      </h1>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          Error al cargar los préstamos: {error.message}
        </div>
      ) : (
        <>          {data && (data.prestamos || data.prestamosPorUsuario) && (data.prestamos || data.prestamosPorUsuario).length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    {currentUser.rol === 'ADMINISTRADOR' && <th>Usuario</th>}
                    <th>Material</th>
                    <th>Fecha Préstamo</th>
                    <th>Fecha Devolución Esperada</th>
                    <th>Fecha Devolución Real</th>
                    <th>Estado</th>
                    <th>Multa</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {(currentUser.rol === 'ADMINISTRADOR' ? data.prestamos : data.prestamosPorUsuario).map(prestamo => (
                    <tr key={prestamo.id}>
                      <td>{prestamo.id}</td>
                      {currentUser.rol === 'ADMINISTRADOR' && (
                        <td>{`${prestamo.usuario.nombre} ${prestamo.usuario.apellido}`}</td>
                      )}
                      <td>{prestamo.material.titulo}</td>
                      <td>{formatDate(prestamo.fechaPrestamo)}</td>
                      <td>{formatDate(prestamo.fechaDevolucionEsperada)}</td>
                      <td>{formatDate(prestamo.fechaDevolucionReal)}</td>
                      <td>
                        <span className={`badge ${
                          prestamo.estado === 'ACTIVO' ? 'bg-primary' :
                          prestamo.estado === 'DEVUELTO' ? 'bg-success' :
                          prestamo.estado === 'VENCIDO' ? 'bg-danger' :
                          'bg-warning'
                        }`}>
                          {prestamo.estado}
                        </span>
                      </td>
                      <td>{prestamo.multa ? `$${prestamo.multa}` : 'N/A'}</td>
                      <td>
                        {prestamo.estado === 'ACTIVO' && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleDevolucion(prestamo.id)}
                            disabled={loadingDevolucion}
                          >
                            {loadingDevolucion ? 'Procesando...' : 'Devolver'}
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-info ms-1"
                          onClick={() => navigate(`/materiales/${prestamo.material.id}`)}
                        >
                          Ver Material
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
            {data && (
            (currentUser.rol === 'ADMINISTRADOR' && (!data.prestamos || data.prestamos.length === 0)) ||
            (currentUser.rol !== 'ADMINISTRADOR' && (!data.prestamosPorUsuario || data.prestamosPorUsuario.length === 0))
          ) && (
            <div className="alert alert-info">
              No hay préstamos para mostrar.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Prestamos;
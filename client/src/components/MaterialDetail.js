import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MATERIAL, GET_RESENAS_MATERIAL } from '../graphql/queries';
import { CREAR_PRESTAMO, CREAR_RESENA } from '../graphql/mutations';
import { useAuth } from '../utils/AuthContext';
import { useNotification } from '../utils/NotificationContext';

const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();
  
  const [resenaForm, setResenaForm] = useState({
    calificacion: 5,
    comentario: ''
  });
  
  const [fechaDevolucion, setFechaDevolucion] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 días desde hoy
  );
  
  // Consulta para obtener los detalles del material
  const { loading, error, data } = useQuery(GET_MATERIAL, {
    variables: { id },
    fetchPolicy: 'cache-and-network'
  });
  
  // Consulta para obtener las reseñas del material
  const { 
    loading: loadingResenas, 
    error: errorResenas, 
    data: dataResenas,
    refetch: refetchResenas
  } = useQuery(GET_RESENAS_MATERIAL, {
    variables: { materialId: id },
    fetchPolicy: 'cache-and-network'
  });
  
  // Mutación para crear un préstamo
  const [crearPrestamo, { loading: loadingPrestamo }] = useMutation(CREAR_PRESTAMO, {
    onCompleted: () => {
      showNotification('Préstamo creado correctamente', 'success');
      navigate('/prestamos');
    },
    onError: (error) => {
      showNotification(`Error al crear el préstamo: ${error.message}`, 'error');
    }
  });
  
  // Mutación para crear una reseña
  const [crearResena, { loading: loadingResena }] = useMutation(CREAR_RESENA, {
    onCompleted: () => {
      showNotification('Reseña creada correctamente', 'success');
      setResenaForm({
        calificacion: 5,
        comentario: ''
      });
      refetchResenas();
    },
    onError: (error) => {
      showNotification(`Error al crear la reseña: ${error.message}`, 'error');
    }
  });
  
  // Función para solicitar un préstamo
  const handleSolicitarPrestamo = () => {
    if (!currentUser) {
      showNotification('Debes iniciar sesión para solicitar un préstamo', 'warning');
      navigate('/login');
      return;
    }
    
    if (loadingPrestamo) return;
      crearPrestamo({
      variables: {
        prestamo: {
          usuarioId: currentUser.id,
          materialId: id,
          fechaDevolucionEsperada: new Date(fechaDevolucion).getTime()
        }
      }
    });
  };
  
  // Función para crear una reseña
  const handleCrearResena = (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      showNotification('Debes iniciar sesión para dejar una reseña', 'warning');
      navigate('/login');
      return;
    }
    
    if (loadingResena) return;
    
    crearResena({
      variables: {
        resena: {
          autorId: currentUser.id,
          materialId: id,
          calificacion: parseInt(resenaForm.calificacion),
          comentario: resenaForm.comentario
        }
      }
    });
  };
  
  // Función para obtener la información específica según el tipo de material
  const getMaterialTypeInfo = () => {
    if (!data || !data.material) return null;
    
    const material = data.material;
    
    if (material.isbn) {
      return (        <div className="mb-3">
          <p><strong>ISBN:</strong> {material.isbn}</p>
          <p><strong>Número de Páginas:</strong> {material.numPaginas}</p>
          <p><strong>Formato:</strong> {material.formatoLibro}</p>
        </div>
      );
    } else if (material.issn) {
      return (
        <div className="mb-3">
          <p><strong>ISSN:</strong> {material.issn}</p>
          <p><strong>Volumen:</strong> {material.volumen}</p>
          <p><strong>Número:</strong> {material.numero}</p>
          <p><strong>Periodicidad:</strong> {material.periodicidad}</p>
        </div>
      );
    } else if (material.url) {
      return (
        <div className="mb-3">
          <p><strong>Formato:</strong> {material.formato}</p>
          <p><strong>Tamaño:</strong> {material.tamanoMB} MB</p>
          <p>
            <a href={material.url} className="btn btn-sm btn-primary" target="_blank" rel="noopener noreferrer">
              Acceder al Material Digital
            </a>
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(parseInt(dateString));
    return date.toLocaleDateString();
  };
  
  return (
    <div className="container py-5">
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          Error al cargar el material: {error.message}
        </div>
      ) : data && data.material ? (
        <div className="row">
          {/* Detalles del Material */}
          <div className="col-md-8">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h2 className="mb-0">{data.material.titulo}</h2>
              </div>
              <div className="card-body">
                <p className="lead">
                  <strong>Autores:</strong> {data.material.autores.join(', ')}
                </p>
                
                <div className="mb-3">
                  <p><strong>Editorial:</strong> {data.material.editorial}</p>
                  <p><strong>Fecha de Publicación:</strong> {formatDate(data.material.fechaPublicacion)}</p>
                  <p><strong>Idioma:</strong> {data.material.idioma}</p>
                  <p>
                    <strong>Categorías:</strong> {data.material.categorias.join(', ')}
                  </p>
                  <p>
                    <strong>Disponibilidad:</strong>{' '}
                    <span className={`badge ${data.material.disponible ? 'bg-success' : 'bg-danger'}`}>
                      {data.material.disponible ? 'Disponible' : 'No Disponible'}
                    </span>
                  </p>
                </div>
                
                {getMaterialTypeInfo()}
                
                {data.material.disponible && currentUser && (
                  <div className="card mb-3">
                    <div className="card-header">
                      <h4>Solicitar Préstamo</h4>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label htmlFor="fechaDevolucion" className="form-label">Fecha de Devolución</label>
                        <input
                          type="date"
                          className="form-control"
                          id="fechaDevolucion"
                          value={fechaDevolucion}
                          onChange={(e) => setFechaDevolucion(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <button
                        className="btn btn-success"
                        onClick={handleSolicitarPrestamo}
                        disabled={loadingPrestamo || !data.material.disponible}
                      >
                        {loadingPrestamo ? 'Procesando...' : 'Solicitar Préstamo'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Reseñas */}
          <div className="col-md-4">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-secondary text-white">
                <h3 className="mb-0">Reseñas</h3>
              </div>
              <div className="card-body">
                {currentUser && (
                  <form onSubmit={handleCrearResena} className="mb-4">
                    <h4>Dejar una Reseña</h4>
                    <div className="mb-3">
                      <label htmlFor="calificacion" className="form-label">Calificación</label>
                      <select
                        className="form-select"
                        id="calificacion"
                        value={resenaForm.calificacion}
                        onChange={(e) => setResenaForm({ ...resenaForm, calificacion: e.target.value })}
                      >
                        <option value="5">5 - Excelente</option>
                        <option value="4">4 - Muy Bueno</option>
                        <option value="3">3 - Bueno</option>
                        <option value="2">2 - Regular</option>
                        <option value="1">1 - Malo</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="comentario" className="form-label">Comentario</label>
                      <textarea
                        className="form-control"
                        id="comentario"
                        rows="3"
                        value={resenaForm.comentario}
                        onChange={(e) => setResenaForm({ ...resenaForm, comentario: e.target.value })}
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loadingResena}
                    >
                      {loadingResena ? 'Enviando...' : 'Enviar Reseña'}
                    </button>
                  </form>
                )}
                
                <h4>Reseñas de Usuarios</h4>
                
                {loadingResenas ? (
                  <p>Cargando reseñas...</p>
                ) : errorResenas ? (
                  <p className="text-danger">Error al cargar reseñas: {errorResenas.message}</p>
                ) : dataResenas && dataResenas.resenasPorMaterial && dataResenas.resenasPorMaterial.length > 0 ? (
                  <div>
                    {dataResenas.resenasPorMaterial.map(resena => (
                      <div key={resena.id} className="card mb-2">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="card-title mb-0">{resena.autor.nombre} {resena.autor.apellido}</h5>
                            <div>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`text-${i < resena.calificacion ? 'warning' : 'secondary'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          {resena.comentario && <p className="card-text">{resena.comentario}</p>}
                          <small className="text-muted">
                            {formatDate(resena.fechaCreacion)}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No hay reseñas para este material.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">
          No se encontró el material solicitado.
        </div>
      )}
    </div>
  );
};

export default MaterialDetail;
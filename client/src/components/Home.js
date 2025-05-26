import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_LIBROS } from '../graphql/queries';

const Home = () => {
  const { loading, error, data } = useQuery(GET_LIBROS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      limit: 6 // Obtener solo algunos libros para mostrar en la página de inicio
    }
  });
  
  return (
    <div className="container py-5">
      <div className="jumbotron bg-light p-5 rounded mb-5">
        <h1 className="display-4">Biblioteca Digital</h1>
        <p className="lead">
          Bienvenido a la plataforma de gestión de biblioteca digital. Explora nuestro catálogo, 
          solicita préstamos y comparte tus opiniones sobre nuestros materiales.
        </p>
        <hr className="my-4" />
        <p>
          Si eres nuevo. Regístrate para acceder a todas las funcionalidades.
        </p>
        <Link to="/materiales" className="btn btn-primary btn-lg">
          Explorar Catálogo
        </Link>
      </div>
      
      <h2 className="mb-4">Novedades en nuestro catálogo</h2>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          Error al cargar los libros: {error.message}
        </div>
      ) : (
        <div className="row">
          {data && data.libros && data.libros.slice(0, 6).map(libro => (
            <div key={libro.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{libro.titulo}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {libro.autores.join(', ')}
                  </h6>
                  <p className="card-text">
                    <small>
                      <strong>Editorial:</strong> {libro.editorial}<br />
                      <strong>ISBN:</strong> {libro.isbn}<br />
                      <strong>Páginas:</strong> {libro.numPaginas}<br />
                      <strong>Disponible:</strong> {libro.disponible ? 'Sí' : 'No'}
                    </small>
                  </p>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <Link to={`/materiales/${libro.id}`} className="btn btn-sm btn-outline-primary">
                    Ver detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <h3 className="card-title">Explora</h3>
              <p className="card-text">
                Descubre nuestro amplio catálogo de libros, revistas y materiales digitales.
              </p>
              <Link to="/materiales" className="btn btn-outline-primary">
                Ver Catálogo
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <h3 className="card-title">Préstamos</h3>
              <p className="card-text">
                Solicita préstamos de materiales y administra tus devoluciones.
              </p>
              <Link to="/prestamos" className="btn btn-outline-primary">
                Mis Préstamos
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <h3 className="card-title">Reseñas</h3>
              <p className="card-text">
                Comparte tus opiniones y descubre lo que otros usuarios piensan sobre nuestros materiales.
              </p>
              <Link to="/resenas" className="btn btn-outline-primary">
                Ver Reseñas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

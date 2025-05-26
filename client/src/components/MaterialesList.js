import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { 
  GET_MATERIALES, 
  BUSCAR_MATERIALES_POR_TITULO,
  BUSCAR_MATERIALES_POR_AUTOR,
  BUSCAR_MATERIALES_POR_CATEGORIA
} from '../graphql/queries';

const MaterialesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('titulo');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  
  // Determinar qué consulta usar basado en el tipo de búsqueda
  const getQueryToUse = () => {
    if (searchTerm) {
      if (searchType === 'titulo') {
        return {
          query: BUSCAR_MATERIALES_POR_TITULO,
          variables: { titulo: searchTerm }
        };
      } else if (searchType === 'autor') {
        return {
          query: BUSCAR_MATERIALES_POR_AUTOR,
          variables: { autor: searchTerm }
        };
      }
    } else if (selectedCategoria) {
      return {
        query: BUSCAR_MATERIALES_POR_CATEGORIA,
        variables: { categoria: selectedCategoria }
      };
    }
    
    return {
      query: GET_MATERIALES
    };
  };
  
  const queryToUse = getQueryToUse();
  
  const { loading, error, data } = useQuery(queryToUse.query, {
    variables: queryToUse.variables,
    fetchPolicy: 'cache-and-network'
  });
  
  // Determinar qué datos mostrar basado en la consulta utilizada
  const getMaterialesToShow = () => {
    if (searchTerm) {
      if (searchType === 'titulo') {
        return data?.buscarMaterialesPorTitulo || [];
      } else if (searchType === 'autor') {
        return data?.buscarMaterialesPorAutor || [];
      }
    } else if (selectedCategoria) {
      return data?.buscarMaterialesPorCategoria || [];
    }
    
    return data?.materiales || [];
  };
  
  const materiales = getMaterialesToShow();
  
  const handleSearch = (e) => {
    e.preventDefault();
    // La búsqueda se actualiza automáticamente con los cambios en el estado
  };
  
  const getMaterialType = (material) => {
    if (material.isbn) return 'Libro';
    if (material.issn) return 'Revista';
    if (material.url) return 'Material Digital';
    return 'Desconocido';
  };
  
  const getMaterialDetails = (material) => {
    if (material.isbn) {
      return (        <>
          <strong>ISBN:</strong> {material.isbn}<br />
          <strong>Páginas:</strong> {material.numPaginas}<br />
          <strong>Formato:</strong> {material.formatoLibro}
        </>
      );
    } else if (material.issn) {
      return (
        <>
          <strong>ISSN:</strong> {material.issn}<br />
          <strong>Volumen:</strong> {material.volumen}<br />
          <strong>Número:</strong> {material.numero}
        </>
      );
    } else if (material.url) {
      return (        <>
          <strong>Formato:</strong> {material.formatoDigital}<br />
          <strong>Tamaño:</strong> {material.tamanoMB} MB<br />
          <a href={material.url} target="_blank" rel="noopener noreferrer">Ver material</a>
        </>
      );
    }
    
    return null;
  };
  
  return (
    <div className="container py-5">
      <h1 className="mb-4">Catálogo de Materiales</h1>
      
      <div className="row mb-4">
        <div className="col-md-8">
          <form onSubmit={handleSearch} className="d-flex">
            <select 
              className="form-select me-2" 
              style={{ width: 'auto' }}
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="titulo">Título</option>
              <option value="autor">Autor</option>
            </select>
            <input 
              type="text" 
              className="form-control me-2" 
              placeholder="Buscar materiales..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Buscar</button>
          </form>
        </div>
        <div className="col-md-4">
          <select 
            className="form-select"
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            <option value="CIENCIA_FICCION">Ciencia Ficción</option>
            <option value="ROMANCE">Romance</option>
            <option value="HISTORIA">Historia</option>
            <option value="CIENCIA">Ciencia</option>
            <option value="TECNOLOGIA">Tecnología</option>
            <option value="ARTE">Arte</option>
            <option value="FILOSOFIA">Filosofía</option>
            <option value="PSICOLOGIA">Psicología</option>
            <option value="EDUCACION">Educación</option>
            <option value="INFANTIL">Infantil</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          Error al cargar los materiales: {error.message}
        </div>
      ) : materiales.length === 0 ? (
        <div className="alert alert-info">
          No se encontraron materiales con los criterios de búsqueda.
        </div>
      ) : (
        <div className="row">
          {materiales.map(material => (
            <div key={material.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-header bg-transparent">
                  <span className="badge bg-secondary">{getMaterialType(material)}</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{material.titulo}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {material.autores.join(', ')}
                  </h6>
                  <p className="card-text">
                    <small>
                      <strong>Editorial:</strong> {material.editorial}<br />
                      <strong>Idioma:</strong> {material.idioma}<br />
                      <strong>Categorías:</strong> {material.categorias.join(', ')}<br />
                      <strong>Disponible:</strong> {material.disponible ? 'Sí' : 'No'}<br />
                      {getMaterialDetails(material)}
                    </small>
                  </p>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <Link to={`/materiales/${material.id}`} className="btn btn-sm btn-outline-primary">
                    Ver detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialesList;

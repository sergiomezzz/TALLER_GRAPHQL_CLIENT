import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USUARIOS, GET_MATERIALES } from '../graphql/queries';
import { 
  CREAR_LIBRO, 
  CREAR_REVISTA, 
  CREAR_MATERIAL_DIGITAL,
  ELIMINAR_LIBRO
} from '../graphql/mutations';
import { useNotification } from '../utils/NotificationContext';

const AdminPanel = () => {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('usuarios');
  const [materialType, setMaterialType] = useState('libro');
  
  // Estado para formularios
  const [libroForm, setLibroForm] = useState({
    titulo: '',
    autores: '',
    fechaPublicacion: '',
    editorial: '',
    idioma: '',
    categorias: [],
    disponible: true,
    isbn: '',
    numPaginas: '',
    formato: 'TAPA_DURA'
  });
  
  const [revistaForm, setRevistaForm] = useState({
    titulo: '',
    autores: '',
    fechaPublicacion: '',
    editorial: '',
    idioma: '',
    categorias: [],
    disponible: true,
    issn: '',
    volumen: '',
    numero: '',
    periodicidad: 'MENSUAL'
  });
  
  const [materialDigitalForm, setMaterialDigitalForm] = useState({
    titulo: '',
    autores: '',
    fechaPublicacion: '',
    editorial: '',
    idioma: '',
    categorias: [],
    disponible: true,
    url: '',
    formato: 'PDF',
    tamanoMB: ''
  });
  
  // Consultas
  const { 
    loading: loadingUsuarios, 
    error: errorUsuarios, 
    data: dataUsuarios 
  } = useQuery(GET_USUARIOS, {
    fetchPolicy: 'cache-and-network'
  });
  
  const { 
    loading: loadingMateriales, 
    error: errorMateriales, 
    data: dataMateriales,
    refetch: refetchMateriales
  } = useQuery(GET_MATERIALES, {
    fetchPolicy: 'cache-and-network'
  });
  
  // Mutaciones
  const [crearLibro, { loading: loadingCrearLibro }] = useMutation(CREAR_LIBRO, {
    onCompleted: () => {
      showNotification('Libro creado correctamente', 'success');
      refetchMateriales();
      setLibroForm({
        titulo: '',
        autores: '',
        fechaPublicacion: '',
        editorial: '',
        idioma: '',
        categorias: [],
        disponible: true,
        isbn: '',
        numPaginas: '',
        formato: 'TAPA_DURA'
      });
    },
    onError: (error) => {
      showNotification(`Error al crear el libro: ${error.message}`, 'error');
    }
  });
  
  const [crearRevista, { loading: loadingCrearRevista }] = useMutation(CREAR_REVISTA, {
    onCompleted: () => {
      showNotification('Revista creada correctamente', 'success');
      refetchMateriales();
      setRevistaForm({
        titulo: '',
        autores: '',
        fechaPublicacion: '',
        editorial: '',
        idioma: '',
        categorias: [],
        disponible: true,
        issn: '',
        volumen: '',
        numero: '',
        periodicidad: 'MENSUAL'
      });
    },
    onError: (error) => {
      showNotification(`Error al crear la revista: ${error.message}`, 'error');
    }
  });
  
  const [crearMaterialDigital, { loading: loadingCrearMaterialDigital }] = useMutation(CREAR_MATERIAL_DIGITAL, {
    onCompleted: () => {
      showNotification('Material digital creado correctamente', 'success');
      refetchMateriales();
      setMaterialDigitalForm({
        titulo: '',
        autores: '',
        fechaPublicacion: '',
        editorial: '',
        idioma: '',
        categorias: [],
        disponible: true,
        url: '',
        formato: 'PDF',
        tamanoMB: ''
      });
    },
    onError: (error) => {
      showNotification(`Error al crear el material digital: ${error.message}`, 'error');
    }
  });
  
  const [eliminarLibro] = useMutation(ELIMINAR_LIBRO, {
    onCompleted: () => {
      showNotification('Material eliminado correctamente', 'success');
      refetchMateriales();
    },
    onError: (error) => {
      showNotification(`Error al eliminar el material: ${error.message}`, 'error');
    }
  });
  
  // Funciones para manejar formularios
  const handleLibroChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'categorias') {
      const categorias = value.split(',').map(cat => cat.trim());
      setLibroForm({
        ...libroForm,
        [name]: categorias
      });
    } else {
      setLibroForm({
        ...libroForm,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  const handleRevistaChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'categorias') {
      const categorias = value.split(',').map(cat => cat.trim());
      setRevistaForm({
        ...revistaForm,
        [name]: categorias
      });
    } else {
      setRevistaForm({
        ...revistaForm,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  const handleMaterialDigitalChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'categorias') {
      const categorias = value.split(',').map(cat => cat.trim());
      setMaterialDigitalForm({
        ...materialDigitalForm,
        [name]: categorias
      });
    } else {
      setMaterialDigitalForm({
        ...materialDigitalForm,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  // Funciones para enviar formularios
  const handleLibroSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos
    if (!libroForm.titulo || !libroForm.autores || !libroForm.fechaPublicacion || 
        !libroForm.editorial || !libroForm.idioma || !libroForm.isbn || !libroForm.numPaginas) {
      showNotification('Por favor, complete todos los campos obligatorios', 'error');
      return;
    }
    
    // Convertir autores a array si es un string
    const autores = typeof libroForm.autores === 'string' 
      ? libroForm.autores.split(',').map(autor => autor.trim())
      : libroForm.autores;
    
    // Convertir numPaginas a entero
    const numPaginas = parseInt(libroForm.numPaginas);
    
    crearLibro({
      variables: {
        libro: {
          ...libroForm,
          autores,
          numPaginas,
          fechaPublicacion: new Date(libroForm.fechaPublicacion).getTime().toString()
        }
      }
    });
  };
  
  const handleRevistaSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos
    if (!revistaForm.titulo || !revistaForm.autores || !revistaForm.fechaPublicacion || 
        !revistaForm.editorial || !revistaForm.idioma || !revistaForm.issn || 
        !revistaForm.volumen || !revistaForm.numero) {
      showNotification('Por favor, complete todos los campos obligatorios', 'error');
      return;
    }
    
    // Convertir autores a array si es un string
    const autores = typeof revistaForm.autores === 'string' 
      ? revistaForm.autores.split(',').map(autor => autor.trim())
      : revistaForm.autores;
    
    // Convertir volumen y numero a enteros
    const volumen = parseInt(revistaForm.volumen);
    const numero = parseInt(revistaForm.numero);
    
    crearRevista({
      variables: {
        revista: {
          ...revistaForm,
          autores,
          volumen,
          numero,
          fechaPublicacion: new Date(revistaForm.fechaPublicacion).getTime().toString()
        }
      }
    });
  };
  
  const handleMaterialDigitalSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos
    if (!materialDigitalForm.titulo || !materialDigitalForm.autores || !materialDigitalForm.fechaPublicacion || 
        !materialDigitalForm.editorial || !materialDigitalForm.idioma || !materialDigitalForm.url || 
        !materialDigitalForm.tamanoMB) {
      showNotification('Por favor, complete todos los campos obligatorios', 'error');
      return;
    }
    
    // Convertir autores a array si es un string
    const autores = typeof materialDigitalForm.autores === 'string' 
      ? materialDigitalForm.autores.split(',').map(autor => autor.trim())
      : materialDigitalForm.autores;
    
    // Convertir tamanoMB a float
    const tamanoMB = parseFloat(materialDigitalForm.tamanoMB);
    
    crearMaterialDigital({
      variables: {
        materialDigital: {
          ...materialDigitalForm,
          autores,
          tamanoMB,
          fechaPublicacion: new Date(materialDigitalForm.fechaPublicacion).getTime().toString()
        }
      }
    });
  };
  
  const handleEliminarMaterial = (id) => {
    if (window.confirm('¿Está seguro de eliminar este material?')) {
      eliminarLibro({
        variables: { id }
      });
    }
  };
  
  return (
    <div className="container py-5">
      <h1 className="mb-4">Panel de Administración</h1>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('usuarios')}
          >
            Usuarios
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'materiales' ? 'active' : ''}`}
            onClick={() => setActiveTab('materiales')}
          >
            Materiales
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'nuevoMaterial' ? 'active' : ''}`}
            onClick={() => setActiveTab('nuevoMaterial')}
          >
            Nuevo Material
          </button>
        </li>
      </ul>
      
      {/* Pestaña de Usuarios */}
      {activeTab === 'usuarios' && (
        <div>
          <h2>Gestión de Usuarios</h2>
          
          {loadingUsuarios ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : errorUsuarios ? (
            <div className="alert alert-danger">
              Error al cargar usuarios: {errorUsuarios.message}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Fecha Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {dataUsuarios && dataUsuarios.usuarios && dataUsuarios.usuarios.map(usuario => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.apellido}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.rol}</td>
                      <td>{new Date(parseInt(usuario.fechaRegistro)).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Pestaña de Materiales */}
      {activeTab === 'materiales' && (
        <div>
          <h2>Gestión de Materiales</h2>
          
          {loadingMateriales ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : errorMateriales ? (
            <div className="alert alert-danger">
              Error al cargar materiales: {errorMateriales.message}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Título</th>
                    <th>Autores</th>
                    <th>Tipo</th>
                    <th>Editorial</th>
                    <th>Disponible</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {dataMateriales && dataMateriales.materiales && dataMateriales.materiales.map(material => (
                    <tr key={material.id}>
                      <td>{material.titulo}</td>
                      <td>{material.autores.join(', ')}</td>
                      <td>
                        {material.isbn ? 'Libro' : material.issn ? 'Revista' : 'Material Digital'}
                      </td>
                      <td>{material.editorial}</td>
                      <td>
                        <span className={`badge ${material.disponible ? 'bg-success' : 'bg-danger'}`}>
                          {material.disponible ? 'Disponible' : 'No Disponible'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleEliminarMaterial(material.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Pestaña de Nuevo Material */}
      {activeTab === 'nuevoMaterial' && (
        <div>
          <h2>Nuevo Material</h2>
          
          <div className="mb-4">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn ${materialType === 'libro' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setMaterialType('libro')}
              >
                Libro
              </button>
              <button
                type="button"
                className={`btn ${materialType === 'revista' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setMaterialType('revista')}
              >
                Revista
              </button>
              <button
                type="button"
                className={`btn ${materialType === 'materialDigital' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setMaterialType('materialDigital')}
              >
                Material Digital
              </button>
            </div>
          </div>
          
          {/* Formulario de Libro */}
          {materialType === 'libro' && (
            <form onSubmit={handleLibroSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="titulo" className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    id="titulo"
                    name="titulo"
                    value={libroForm.titulo}
                    onChange={handleLibroChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="autores" className="form-label">Autores (separados por comas)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="autores"
                    name="autores"
                    value={libroForm.autores}
                    onChange={handleLibroChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="fechaPublicacion" className="form-label">Fecha de Publicación</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaPublicacion"
                    name="fechaPublicacion"
                    value={libroForm.fechaPublicacion}
                    onChange={handleLibroChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="editorial" className="form-label">Editorial</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editorial"
                    name="editorial"
                    value={libroForm.editorial}
                    onChange={handleLibroChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="idioma" className="form-label">Idioma</label>
                  <input
                    type="text"
                    className="form-control"
                    id="idioma"
                    name="idioma"
                    value={libroForm.idioma}
                    onChange={handleLibroChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="categorias" className="form-label">Categorías (separadas por comas)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="categorias"
                    name="categorias"
                    value={libroForm.categorias}
                    onChange={handleLibroChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="isbn" className="form-label">ISBN</label>
                  <input
                    type="text"
                    className="form-control"
                    id="isbn"
                    name="isbn"
                    value={libroForm.isbn}
                    onChange={handleLibroChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="numPaginas" className="form-label">Número de Páginas</label>
                  <input
                    type="number"
                    className="form-control"
                    id="numPaginas"
                    name="numPaginas"
                    value={libroForm.numPaginas}
                    onChange={handleLibroChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="formato" className="form-label">Formato</label>
                  <select
                    className="form-select"
                    id="formato"
                    name="formato"
                    value={libroForm.formato}
                    onChange={handleLibroChange}
                    required
                  >
                    <option value="TAPA_DURA">Tapa Dura</option>
                    <option value="TAPA_BLANDA">Tapa Blanda</option>
                    <option value="BOLSILLO">Bolsillo</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="disponible"
                      name="disponible"
                      checked={libroForm.disponible}
                      onChange={handleLibroChange}
                    />
                    <label className="form-check-label" htmlFor="disponible">
                      Disponible
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loadingCrearLibro}
                  >
                    {loadingCrearLibro ? 'Guardando...' : 'Guardar Libro'}
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Formulario de Revista */}
          {materialType === 'revista' && (
            <form onSubmit={handleRevistaSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="titulo" className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    id="titulo"
                    name="titulo"
                    value={revistaForm.titulo}
                    onChange={handleRevistaChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="autores" className="form-label">Autores (separados por comas)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="autores"
                    name="autores"
                    value={revistaForm.autores}
                    onChange={handleRevistaChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="fechaPublicacion" className="form-label">Fecha de Publicación</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaPublicacion"
                    name="fechaPublicacion"
                    value={revistaForm.fechaPublicacion}
                    onChange={handleRevistaChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="editorial" className="form-label">Editorial</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editorial"
                    name="editorial"
                    value={revistaForm.editorial}
                    onChange={handleRevistaChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="idioma" className="form-label">Idioma</label>
                  <input
                    type="text"
                    className="form-control"
                    id="idioma"
                    name="idioma"
                    value={revistaForm.idioma}
                    onChange={handleRevistaChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="categorias" className="form-label">Categorías (separadas por comas)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="categorias"
                    name="categorias"
                    value={revistaForm.categorias}
                    onChange={handleRevistaChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="issn" className="form-label">ISSN</label>
                  <input
                    type="text"
                    className="form-control"
                    id="issn"
                    name="issn"
                    value={revistaForm.issn}
                    onChange={handleRevistaChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="volumen" className="form-label">Volumen</label>
                  <input
                    type="number"
                    className="form-control"
                    id="volumen"
                    name="volumen"
                    value={revistaForm.volumen}
                    onChange={handleRevistaChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="numero" className="form-label">Número</label>
                  <input
                    type="number"
                    className="form-control"
                    id="numero"
                    name="numero"
                    value={revistaForm.numero}
                    onChange={handleRevistaChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="periodicidad" className="form-label">Periodicidad</label>
                  <select
                    className="form-select"
                    id="periodicidad"
                    name="periodicidad"
                    value={revistaForm.periodicidad}
                    onChange={handleRevistaChange}
                    required
                  >
                    <option value="DIARIA">Diaria</option>
                    <option value="SEMANAL">Semanal</option>
                    <option value="QUINCENAL">Quincenal</option>
                    <option value="MENSUAL">Mensual</option>
                    <option value="TRIMESTRAL">Trimestral</option>
                    <option value="SEMESTRAL">Semestral</option>
                    <option value="ANUAL">Anual</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="disponible"
                      name="disponible"
                      checked={revistaForm.disponible}
                      onChange={handleRevistaChange}
                    />
                    <label className="form-check-label" htmlFor="disponible">
                      Disponible
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loadingCrearRevista}
                  >
                    {loadingCrearRevista ? 'Guardando...' : 'Guardar Revista'}
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Formulario de Material Digital */}
          {materialType === 'materialDigital' && (
            <form onSubmit={handleMaterialDigitalSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="titulo" className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    id="titulo"
                    name="titulo"
                    value={materialDigitalForm.titulo}
                    onChange={handleMaterialDigitalChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="autores" className="form-label">Autores (separados por comas)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="autores"
                    name="autores"
                    value={materialDigitalForm.autores}
                    onChange={handleMaterialDigitalChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="fechaPublicacion" className="form-label">Fecha de Publicación</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaPublicacion"
                    name="fechaPublicacion"
                    value={materialDigitalForm.fechaPublicacion}
                    onChange={handleMaterialDigitalChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="editorial" className="form-label">Editorial</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editorial"
                    name="editorial"
                    value={materialDigitalForm.editorial}
                    onChange={handleMaterialDigitalChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="idioma" className="form-label">Idioma</label>
                  <input
                    type="text"
                    className="form-control"
                    id="idioma"
                    name="idioma"
                    value={materialDigitalForm.idioma}
                    onChange={handleMaterialDigitalChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="categorias" className="form-label">Categorías (separadas por comas)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="categorias"
                    name="categorias"
                    value={materialDigitalForm.categorias}
                    onChange={handleMaterialDigitalChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="url" className="form-label">URL</label>
                  <input
                    type="url"
                    className="form-control"
                    id="url"
                    name="url"
                    value={materialDigitalForm.url}
                    onChange={handleMaterialDigitalChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="formato" className="form-label">Formato</label>
                  <select
                    className="form-select"
                    id="formato"
                    name="formato"
                    value={materialDigitalForm.formato}
                    onChange={handleMaterialDigitalChange}
                    required
                  >
                    <option value="PDF">PDF</option>
                    <option value="EPUB">EPUB</option>
                    <option value="MOBI">MOBI</option>
                    <option value="DOC">DOC</option>
                    <option value="HTML">HTML</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="tamanoMB" className="form-label">Tamaño (MB)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="tamanoMB"
                    name="tamanoMB"
                    value={materialDigitalForm.tamanoMB}
                    onChange={handleMaterialDigitalChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="disponible"
                      name="disponible"
                      checked={materialDigitalForm.disponible}
                      onChange={handleMaterialDigitalChange}
                    />
                    <label className="form-check-label" htmlFor="disponible">
                      Disponible
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loadingCrearMaterialDigital}
                  >
                    {loadingCrearMaterialDigital ? 'Guardando...' : 'Guardar Material Digital'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
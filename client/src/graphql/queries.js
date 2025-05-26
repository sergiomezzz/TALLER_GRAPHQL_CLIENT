import { gql } from '@apollo/client';

// Consultas para materiales bibliográficos
export const GET_MATERIALES = gql`
  query GetMateriales {
    materiales {
      id
      titulo
      autores
      fechaPublicacion
      editorial
      idioma
      categorias
      disponible
      ... on Libro {
        isbn
        numPaginas
        formatoLibro: formato
      }
      ... on Revista {
        issn
        volumen
        numero
        periodicidad
      }
      ... on MaterialDigital {
        url
        formatoDigital: formato
        tamanoMB
      }
    }
  }
`;

export const GET_MATERIAL = gql`
  query GetMaterial($id: ID!) {
    material(id: $id) {
      id
      titulo
      autores
      fechaPublicacion
      editorial
      idioma
      categorias
      disponible
      ... on Libro {
        isbn
        numPaginas
        formatoLibro: formato
      }
      ... on Revista {
        issn
        volumen
        numero
        periodicidad
      }
      ... on MaterialDigital {
        url
        formatoDigital: formato
        tamanoMB
      }
    }
  }
`;

export const GET_LIBROS = gql`
  query GetLibros {
    libros {
      id
      titulo
      autores
      fechaPublicacion
      editorial
      idioma
      categorias
      disponible
      isbn
      numPaginas
      formato
    }
  }
`;

export const GET_REVISTAS = gql`
  query GetRevistas {
    revistas {
      id
      titulo
      autores
      fechaPublicacion
      editorial
      idioma
      categorias
      disponible
      issn
      volumen
      numero
      periodicidad
    }
  }
`;

export const GET_MATERIALES_DIGITALES = gql`
  query GetMaterialesDigitales {
    materialesDigitales {
      id
      titulo
      autores
      fechaPublicacion
      editorial
      idioma
      categorias
      disponible
      url
      formatoDigital: formato
      tamanoMB
    }
  }
`;

export const BUSCAR_MATERIALES_POR_TITULO = gql`
  query BuscarMaterialesPorTitulo($titulo: String!) {
    buscarMaterialesPorTitulo(titulo: $titulo) {
      id
      titulo
      autores
      fechaPublicacion
      editorial
      idioma
      categorias
      disponible
      ... on Libro {
        isbn
        numPaginas
        formatoLibro: formato
      }
      ... on Revista {
        issn
        volumen
        numero
        periodicidad
      }
      ... on MaterialDigital {
        url
        formatoDigital: formato
        tamanoMB
      }
    }
  }
`;

export const BUSCAR_MATERIALES_POR_AUTOR = gql`
  query BuscarMaterialesPorAutor($autor: String!) {
    buscarMaterialesPorAutor(autor: $autor) {
      id
      titulo
      autores
      fechaPublicacion
      editorial
      idioma
      categorias
      disponible
      ... on Libro {
        isbn
        numPaginas
        formatoLibro: formato
      }
      ... on Revista {
        issn
        volumen
        numero
        periodicidad
      }
      ... on MaterialDigital {
        url
        formatoDigital: formato
        tamanoMB
      }
    }
  }
`;

export const BUSCAR_MATERIALES_POR_CATEGORIA = gql`
  query BuscarMaterialesPorCategoria($categoria: CategoriaEnum!) {
    buscarMaterialesPorCategoria(categoria: $categoria) {
      id
      titulo
      autores
      fechaPublicacion
      editorial
      idioma
      categorias
      disponible
      ... on Libro {
        isbn
        numPaginas
        formatoLibro: formato
      }
      ... on Revista {
        issn
        volumen
        numero
        periodicidad
      }
      ... on MaterialDigital {
        url
        formatoDigital: formato
        tamanoMB
      }
    }
  }
`;

// Consultas para usuarios
export const GET_USUARIOS = gql`
  query GetUsuarios {
    usuarios {
      id
      nombre
      apellido
      email
      rol
      fechaRegistro
    }
  }
`;

export const GET_USUARIO = gql`
  query GetUsuario($id: ID!) {
    usuario(id: $id) {
      id
      nombre
      apellido
      email
      rol
      fechaRegistro
      prestamos {
        id
        fechaPrestamo
        fechaDevolucionEsperada
        fechaDevolucionReal
        estado
        multa
        material {
          id
          titulo
        }
      }
      resenas {
        id
        calificacion
        comentario
        fechaCreacion
        material {
          id
          titulo
        }
      }
    }
  }
`;

// Consultas para préstamos
export const GET_PRESTAMOS = gql`
  query GetPrestamos {
    prestamos {
      id
      fechaPrestamo
      fechaDevolucionEsperada
      fechaDevolucionReal
      estado
      multa
      usuario {
        id
        nombre
        apellido
      }
      material {
        id
        titulo
        ... on Libro {
          isbn
        }
        ... on Revista {
          issn
        }
        ... on MaterialDigital {
          url
        }
      }
    }
  }
`;

export const GET_PRESTAMOS_USUARIO = gql`
  query GetPrestamosPorUsuario($usuarioId: ID!) {
    prestamosPorUsuario(usuarioId: $usuarioId) {
      id
      fechaPrestamo
      fechaDevolucionEsperada
      fechaDevolucionReal
      estado
      multa
      material {
        id
        titulo
        ... on Libro {
          isbn
        }
        ... on Revista {
          issn
        }
        ... on MaterialDigital {
          url
        }
      }
    }
  }
`;

// Consultas para reseñas
export const GET_RESENAS = gql`
  query GetResenas {
    resenas {
      id
      calificacion
      comentario
      fechaCreacion
      fechaModificacion
      autor {
        id
        nombre
        apellido
      }
      material {
        id
        titulo
      }
    }
  }
`;

export const GET_RESENAS_MATERIAL = gql`
  query GetResenasPorMaterial($materialId: ID!) {
    resenasPorMaterial(materialId: $materialId) {
      id
      calificacion
      comentario
      fechaCreacion
      fechaModificacion
      autor {
        id
        nombre
        apellido
      }
    }
  }
`;

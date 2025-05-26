import { gql } from '@apollo/client';

// Mutaciones para materiales bibliográficos
export const CREAR_LIBRO = gql`
  mutation CrearLibro($libro: LibroInput!) {
    crearLibro(libro: $libro) {
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
      formatoLibro: formato
    }
  }
`;

export const ACTUALIZAR_LIBRO = gql`
  mutation ActualizarLibro($id: ID!, $libro: LibroInput!) {
    actualizarLibro(id: $id, libro: $libro) {
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
      formatoLibro: formato
    }
  }
`;

export const ELIMINAR_LIBRO = gql`
  mutation EliminarLibro($id: ID!) {
    eliminarLibro(id: $id)
  }
`;

export const CREAR_REVISTA = gql`
  mutation CrearRevista($revista: RevistaInput!) {
    crearRevista(revista: $revista) {
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

export const CREAR_MATERIAL_DIGITAL = gql`
  mutation CrearMaterialDigital($materialDigital: MaterialDigitalInput!) {
    crearMaterialDigital(materialDigital: $materialDigital) {
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

// Mutaciones para usuarios
export const REGISTRAR_USUARIO = gql`
  mutation RegistrarUsuario($usuario: UsuarioInput!) {
    registrarUsuario(usuario: $usuario) {
      id
      nombre
      apellido
      email
      rol
      fechaRegistro
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

// Mutaciones para préstamos
export const CREAR_PRESTAMO = gql`
  mutation CrearPrestamo($prestamo: PrestamoInput!) {
    crearPrestamo(prestamo: $prestamo) {
      id
      fechaPrestamo
      fechaDevolucionEsperada
      estado
      usuario {
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

export const REGISTRAR_DEVOLUCION = gql`
  mutation RegistrarDevolucion($prestamoId: ID!) {
    registrarDevolucion(prestamoId: $prestamoId) {
      id
      fechaDevolucionReal
      estado
      multa
    }
  }
`;

// Mutaciones para reseñas
export const CREAR_RESENA = gql`
  mutation CrearResena($resena: ResenaInput!) {
    crearResena(resena: $resena) {
      id
      calificacion
      comentario
      fechaCreacion
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

export const ACTUALIZAR_RESENA = gql`
  mutation ActualizarResena($id: ID!, $resena: ResenaInput!) {
    actualizarResena(id: $id, resena: $resena) {
      id
      calificacion
      comentario
      fechaModificacion
    }
  }
`;

export const ELIMINAR_RESENA = gql`
  mutation EliminarResena($id: ID!) {
    eliminarResena(id: $id)
  }
`;

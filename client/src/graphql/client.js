import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Crear el enlace HTTP para la conexión con el servidor GraphQL
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL,
});

// Configurar el middleware para la autenticación
const authLink = setContext((_, { headers }) => {
  // Obtener el token de autenticación del almacenamiento local
  const token = localStorage.getItem('token');
  
  // Devolver los headers con el token si existe
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Crear el cliente Apollo
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Configuración para manejar paginación, caché, etc.
        }
      }
    }
  })
});

export default client;

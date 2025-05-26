# Sistema de Gestión de Biblioteca - Cliente

Este proyecto es la interfaz web para el Sistema de Gestión de Biblioteca desarrollado por Sergio Gómez. Permite a los usuarios interactuar con la biblioteca digital, consultar materiales, gestionar préstamos y dejar reseñas.

## Características principales
- Catálogo de libros, revistas y materiales digitales
- Búsqueda y filtrado de materiales
- Registro y autenticación de usuarios
- Gestión de préstamos y devoluciones
- Sistema de reseñas y calificaciones
- Panel de administración para roles avanzados
- Notificaciones y alertas

## Requisitos funcionales cubiertos
- Consulta y búsqueda de materiales
- Registro y gestión de usuarios
- Préstamos y devoluciones
- Gestión de reseñas
- Roles: Administrador, Bibliotecario, Lector

## Requisitos no funcionales
- Interfaz intuitiva y adaptable (responsive)
- Seguridad: autenticación JWT, control de acceso por roles
- Rendimiento: consultas rápidas y eficientes
- Mantenibilidad: código modular y documentado

## Instalación y uso

1. Instala las dependencias:
   ```powershell
   cd client
   npm install
   ```
2. Inicia la aplicación en modo desarrollo:
   ```powershell
   npm start
   ```
3. Accede a [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del proyecto
- `src/components/`: Componentes principales de la interfaz
- `src/graphql/`: Consultas y mutaciones GraphQL
- `src/utils/`: Contextos y utilidades para autenticación y notificaciones

## Variables de calidad
- Tiempo de respuesta: < 1s en operaciones CRUD
- Seguridad: JWT, roles, protección de datos
- Usabilidad: tareas comunes en menos de 3 clics
- Testabilidad: preparado para pruebas unitarias y de integración

## Tecnologías utilizadas
- React
- Apollo Client
- React Router
- Bootstrap

## Contacto
Desarrollado por Sergio Gómez.
Correo: sergio.gomez05@uptc.edu.co

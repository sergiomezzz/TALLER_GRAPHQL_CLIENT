import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';
import { AuthProvider } from './utils/AuthContext';
import { NotificationProvider } from './utils/NotificationContext';
import { ProtectedRoute, AdminRoute } from './utils/ProtectedRoutes';

// Componentes
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import Home from './components/Home';
import Login from './components/Login';
import Registro from './components/Registro';
import MaterialesList from './components/MaterialesList';
import MaterialDetail from './components/MaterialDetail';
import Prestamos from './components/Prestamos';
import AdminPanel from './components/AdminPanel';
import NotFound from './components/NotFound';

// Estilos
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <div className="App d-flex flex-column min-vh-100">
              <Navbar />
              <Notification />
              <main className="flex-grow-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registro" element={<Registro />} />
                  <Route path="/materiales" element={<MaterialesList />} />
                  <Route path="/materiales/:id" element={<MaterialDetail />} />
                  <Route path="/prestamos" element={
                    <ProtectedRoute>
                      <Prestamos />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  } />
                </Routes>
              </main>
              <footer className="bg-light py-3 mt-auto">
                <div className="container text-center">
                  <p className="mb-0">Biblioteca Digital &copy; {new Date().getFullYear()} - Desarrollado por Sergio Gómez</p>
                </div>
              </footer>
            </div>
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </ApolloProvider>
  );
}

export default App;

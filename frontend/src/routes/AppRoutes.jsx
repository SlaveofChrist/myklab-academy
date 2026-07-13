import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Catalogue from '../pages/Catalogue';
import CoursDetail from '../pages/CoursDetail';

/**
 * Version simple pour cette étape : si pas de token, on redirige vers /login.
 * À l'étape 3, ce sera formalisé en un vrai composant <PrivateRoute> réutilisable,
 * avec en plus la distinction de routes selon le rôle (Referent vs Apprenant).
 */
function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
      <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/catalogue" element={token ? <Catalogue /> : <Navigate to="/login" />} />
      <Route path="/cours/:id" element={token ? <CoursDetail /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes;

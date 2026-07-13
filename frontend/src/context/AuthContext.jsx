import { createContext, useState } from 'react';
import { loginRequest, registerRequest } from '../api/auth.api';

export const AuthContext = createContext(null);

/**
 * Fournit à toute l'app : l'utilisateur connecté, son token, et les fonctions
 * login/register/logout. Persiste dans localStorage pour survivre à un
 * rechargement de page (F5).
 */
export function AuthProvider({ children }) {
  // Au premier rendu, on essaie de récupérer une session déjà existante
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [error, setError] = useState(null);

  function persistSession(userData, tokenValue) {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenValue);
  }

  async function login({ email, mdp }) {
    setError(null);
    try {
      const { user: userData, token: tokenValue } = await loginRequest({ email, mdp });
      persistSession(userData, tokenValue);
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || "Erreur de connexion";
      setError(message);
      throw new Error(message);
    }
  }

  async function register({ nom, email, mdp, role }) {
    setError(null);
    try {
      const { user: userData, token: tokenValue } = await registerRequest({ nom, email, mdp, role });
      persistSession(userData, tokenValue);
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || "Erreur d'inscription";
      setError(message);
      throw new Error(message);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  return (
    <AuthContext.Provider value={{ user, token, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

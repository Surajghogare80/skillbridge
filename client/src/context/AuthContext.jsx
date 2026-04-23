import { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser } from '../services/authService';

/* ─────────────────────────────────────────────────────────────
   Storage keys — centralised so nothing is ever misspelled
──────────────────────────────────────────────────────────────── */
const TOKEN_KEY = 'skillbridge_token';
const USER_KEY  = 'skillbridge_user';

/* ─────────────────────────────────────────────────────────────
   JWT payload decoder (no external library needed)
   Returns null if the token is malformed or expired.
──────────────────────────────────────────────────────────────── */
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Reject if already expired
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

/* ─────────────────────────────────────────────────────────────
   Persist + read user info from localStorage.
   We store the full user object (name, email, role, id) so
   the UI can greet the user correctly without an extra API call.
──────────────────────────────────────────────────────────────── */
const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveStoredUser = (userObj) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userObj));
};

const clearStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/* ─────────────────────────────────────────────────────────────
   Context
──────────────────────────────────────────────────────────────── */
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialise from localStorage on first render
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user,  setUser]  = useState(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) return null;
    // Validate token is not expired
    const decoded = decodeToken(storedToken);
    if (!decoded) { clearStorage(); return null; }
    // Prefer the richer stored user object; fall back to just the id
    return readStoredUser() || { id: decoded.id };
  });
  const [loading, setLoading] = useState(true);

  // Mark loading=false once initial state is set
  useEffect(() => {
    setLoading(false);
  }, []);

  /* ── Login ── */
  const login = useCallback(async (email, password) => {
    // loginUser returns { message, token, user: { id, name, email, role } }
    const data = await loginUser(email, password);

    // Validate the received token before trusting it
    if (!decodeToken(data.token)) {
      throw new Error('Received an invalid token from server.');
    }

    localStorage.setItem(TOKEN_KEY, data.token);

    // Merge JWT payload id with the richer user object from the response
    const userObj = data.user
      ? { ...data.user, id: data.user.id || data.user._id }
      : { id: decodeToken(data.token)?.id };

    saveStoredUser(userObj);
    setToken(data.token);
    setUser(userObj);

    return data;
  }, []);

  /* ── Register ── */
  const register = useCallback(async (name, email, password) => {
    return await registerUser(name, email, password);
  }, []);

  /* ── Logout ── */
  const logout = useCallback(() => {
    clearStorage();
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

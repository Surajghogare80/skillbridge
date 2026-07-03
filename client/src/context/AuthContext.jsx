import { createContext, useState, useEffect, useCallback } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  signOut as firebaseSignOut 
} from '../firebase/firebase';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  /**
   * Synchronize user with backend
   */
  const syncUserWithBackend = useCallback(async (firebaseUser, provider = 'email') => {
    if (!firebaseUser) return null;

    try {
      const token = await firebaseUser.getIdToken();
      
      const response = await axios.post(`${API_URL}/auth/sync`, 
        { authProvider: provider },
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );

      if (response.data.success) {
        // Merge Firebase and MongoDB data
        const userData = {
          ...response.data.user,
          uid: firebaseUser.uid,
          emailVerified: firebaseUser.emailVerified,
          token
        };
        setUser(userData);
        return userData;
      }
    } catch (error) {
      console.error("Backend sync failed:", error);
      toast.error("Failed to sync user data with server.");
      return null;
    }
  }, []);

  /**
   * Listen for Auth state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // User is signed in, sync with backend
        await syncUserWithBackend(firebaseUser);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncUserWithBackend]);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed: " + error.message);
    }
  }, []);

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    isAuthenticating,
    setIsAuthenticating,
    isAuthenticated,
    logout,
    syncUserWithBackend
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

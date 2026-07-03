import axios from 'axios';
import { auth, signInWithPopup, googleProvider, signOut as firebaseSignOut } from '../firebase/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL
});

// Add interceptor to include Firebase token in requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Enroll in a course (requires auth)
export const enrollInCourse = async (courseId) => {
  const response = await api.post(`/auth/enroll/${courseId}`);
  return response.data;
};

// Any other auth-related API calls can go here
export default api;

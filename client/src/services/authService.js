import api from './api';

// Register a new user
export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

// Login user — returns { message, token }
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Enroll in a course (requires auth)
export const enrollInCourse = async (courseId) => {
  const response = await api.post(`/auth/enroll/${courseId}`);
  return response.data;
};

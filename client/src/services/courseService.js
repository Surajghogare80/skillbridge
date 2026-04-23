import api from './api';

// Fetch all courses
export const getAllCourses = async () => {
  const response = await api.get('/courses');
  return response.data;
};

// Fetch single course by ID
export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

// Fetch enrolled courses for the logged-in user
export const getMyCourses = async () => {
  const response = await api.get('/users/my-courses');
  return response.data;
};

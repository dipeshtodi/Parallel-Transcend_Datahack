import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (username, password) => api.post('/login', { username, password });
export const register = (username, email, password) => api.post('/register', { username, email, password });
export const getNextFlashcard = () => api.get('/next-flashcard');
export const submitAnswer = (flashcardId, correct, responseTime) => api.post('/submit-answer', { flashcardId, correct, responseTime });
export const getRecommendations = () => api.get('/recommendations');
export const generateFlashcard = (topic) => api.post('/generate-flashcard', { topic });
export const getRelatedTopics = (topic) => api.get(`/related-topics?topic=${topic}`);
export const getDueFlashcards = () => api.get('/due-flashcards');

export default api;
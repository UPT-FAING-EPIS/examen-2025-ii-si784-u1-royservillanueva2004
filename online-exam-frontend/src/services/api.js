import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5013/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const examAPI = {
  // Exámenes
  getExams: () => api.get('/exams'),
  getExam: (id) => api.get(`/exams/${id}`),
  createExam: (examData) => api.post('/exams', examData),
  deleteExam: (id) => api.delete(`/exams/${id}`),

  // Preguntas
  getQuestions: (examId) => api.get(`/questions/${examId}`),
  createQuestion: (questionData) => api.post('/questions', questionData),

  // Envíos de exámenes
  submitExam: (submissionData) => api.post('/submissions', submissionData),
  getResults: (userId) => api.get(`/submissions/${userId}`),
};

export default api;
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5013/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging de requests
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Enviando ${config.method?.toUpperCase()} a ${config.url}`);
    console.log('📦 Datos:', config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para logging de responses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Respuesta ${response.status} de ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Error API:', {
      URL: error.config?.url,
      Método: error.config?.method,
      Status: error.response?.status,
      Mensaje: error.response?.data || error.message,
      Datos: error.config?.data
    });
    return Promise.reject(error);
  }
);

export const examAPI = {
  // Exámenes
  getExams: () => api.get('/exams'),
  getExam: (id) => api.get(`/exams/${id}`),
  createExam: (examData) => {
    // Formatear los datos para que coincidan con el backend
    const formattedData = {
      Title: examData.title,
      Description: examData.description,
      Duration: parseInt(examData.duration),
      CreatedBy: examData.createdBy || "profesor@ejemplo.com",
      Questions: examData.questions?.map(q => ({
        Text: q.text,
        Type: q.type,
        Points: parseInt(q.points),
        CorrectAnswer: q.correctAnswer,
        Options: q.options || []
      })) || []
    };
    
    console.log('📤 Datos formateados para backend:', formattedData);
    return api.post('/exams', formattedData);
  },
  deleteExam: (id) => api.delete(`/exams/${id}`)
};

export default api;
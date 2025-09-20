import React, { useState, useEffect } from 'react';
import { examAPI } from '../services/api';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await examAPI.getExams();
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando exámenes...</div>;

  return (
    <div className="exam-list">
      <h2>Exámenes Disponibles</h2>
      {exams.length === 0 ? (
        <p>No hay exámenes disponibles.</p>
      ) : (
        <div className="exams-grid">
          {exams.map((exam) => (
            <div key={exam.id} className="exam-card">
              <h3>{exam.title}</h3>
              <p>{exam.description}</p>
              <p>Duración: {exam.duration} minutos</p>
              <button onClick={() => window.location.href = `/exam/${exam.id}`}>
                Tomar Examen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamList;
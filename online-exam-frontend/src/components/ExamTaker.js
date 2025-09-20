import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { examAPI } from '../services/api';

const ExamTaker = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExam();
  }, [id]);

  useEffect(() => {
    if (exam && exam.duration) {
      setTimeLeft(exam.duration * 60);
      startTimer();
    }
  }, [exam]);

  const fetchExam = async () => {
    try {
      const response = await examAPI.getExam(id);
      setExam(response.data);
    } catch (error) {
      console.error('Error fetching exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    try {
      const submission = {
        examId: parseInt(id),
        studentId: 'user123', // Reemplazar con ID real del usuario
        answers: answers,
        isCompleted: true
      };

      await examAPI.submitExam(submission);
      alert('Examen enviado correctamente!');
      window.location.href = '/';
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Error al enviar el examen');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div>Cargando examen...</div>;
  if (!exam) return <div>Examen no encontrado</div>;

  const question = exam.questions[currentQuestion];

  return (
    <div className="exam-container">
      <div className="exam-header">
        <h1>{exam.title}</h1>
        <div className="timer">Tiempo restante: {formatTime(timeLeft)}</div>
      </div>

      <div className="question-container">
        <h3>Pregunta {currentQuestion + 1} de {exam.questions.length}</h3>
        <p>{question.text}</p>

        {question.type === 'multiple' && (
          <div className="options">
            {question.options.map((option, index) => (
              <label key={index} className="option">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  onChange={() => handleAnswer(question.id, option)}
                  checked={answers[question.id] === option}
                />
                {option}
              </label>
            ))}
          </div>
        )}

        {question.type === 'truefalse' && (
          <div className="options">
            <label className="option">
              <input
                type="radio"
                name={`question-${question.id}`}
                value="true"
                onChange={() => handleAnswer(question.id, 'true')}
                checked={answers[question.id] === 'true'}
              />
              Verdadero
            </label>
            <label className="option">
              <input
                type="radio"
                name={`question-${question.id}`}
                value="false"
                onChange={() => handleAnswer(question.id, 'false')}
                checked={answers[question.id] === 'false'}
              />
              Falso
            </label>
          </div>
        )}

        {question.type === 'open' && (
          <textarea
            className="open-answer"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            rows={4}
          />
        )}
      </div>

      <div className="navigation">
        <button
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
        >
          Anterior
        </button>
        
        <span>Pregunta {currentQuestion + 1} de {exam.questions.length}</span>
        
        {currentQuestion < exam.questions.length - 1 ? (
          <button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
            Siguiente
          </button>
        ) : (
          <button onClick={handleSubmit} className="submit-btn">
            Finalizar Examen
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamTaker;
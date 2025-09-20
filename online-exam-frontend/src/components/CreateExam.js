import React, { useState } from 'react';
import { examAPI } from '../services/api';

const CreateExam = () => {
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 30,
    createdBy: 'teacher1',
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'multiple',
    points: 10,
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  const handleExamChange = (e) => {
    setExamData({
      ...examData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      [e.target.name]: e.target.value
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const addQuestion = () => {
    if (currentQuestion.text && currentQuestion.correctAnswer) {
      setExamData({
        ...examData,
        questions: [...examData.questions, { ...currentQuestion }]
      });
      
      // Reset current question
      setCurrentQuestion({
        text: '',
        type: 'multiple',
        points: 10,
        options: ['', '', '', ''],
        correctAnswer: ''
      });
    }
  };

  const submitExam = async () => {
    try {
      await examAPI.createExam(examData);
      alert('Examen creado exitosamente!');
      window.location.href = '/';
    } catch (error) {
      console.error('Error creating exam:', error);
      alert('Error al crear el examen');
    }
  };

  return (
    <div className="create-exam">
      <h2>Crear Nuevo Examen</h2>
      
      <div className="exam-form">
        <input
          type="text"
          name="title"
          placeholder="Título del examen"
          value={examData.title}
          onChange={handleExamChange}
        />
        
        <textarea
          name="description"
          placeholder="Descripción"
          value={examData.description}
          onChange={handleExamChange}
        />
        
        <input
          type="number"
          name="duration"
          placeholder="Duración en minutos"
          value={examData.duration}
          onChange={handleExamChange}
        />
      </div>

      <div className="question-form">
        <h3>Agregar Pregunta</h3>
        
        <textarea
          name="text"
          placeholder="Texto de la pregunta"
          value={currentQuestion.text}
          onChange={handleQuestionChange}
        />
        
        <select
          name="type"
          value={currentQuestion.type}
          onChange={handleQuestionChange}
        >
          <option value="multiple">Opción Múltiple</option>
          <option value="truefalse">Verdadero/Falso</option>
          <option value="open">Respuesta Abierta</option>
        </select>
        
        <input
          type="number"
          name="points"
          placeholder="Puntos"
          value={currentQuestion.points}
          onChange={handleQuestionChange}
        />

        {currentQuestion.type === 'multiple' && (
          <div className="options-form">
            {currentQuestion.options.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder={`Opción ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                <input
                  type="radio"
                  name="correctOption"
                  checked={currentQuestion.correctAnswer === option}
                  onChange={() => setCurrentQuestion({
                    ...currentQuestion,
                    correctAnswer: option
                  })}
                />
                Correcta
              </div>
            ))}
          </div>
        )}

        {currentQuestion.type === 'truefalse' && (
          <div>
            <label>
              <input
                type="radio"
                name="correctAnswer"
                value="true"
                checked={currentQuestion.correctAnswer === 'true'}
                onChange={handleQuestionChange}
              />
              Verdadero
            </label>
            <label>
              <input
                type="radio"
                name="correctAnswer"
                value="false"
                checked={currentQuestion.correctAnswer === 'false'}
                onChange={handleQuestionChange}
              />
              Falso
            </label>
          </div>
        )}

        {currentQuestion.type === 'open' && (
          <input
            type="text"
            name="correctAnswer"
            placeholder="Respuesta esperada"
            value={currentQuestion.correctAnswer}
            onChange={handleQuestionChange}
          />
        )}

        <button onClick={addQuestion}>Agregar Pregunta</button>
      </div>

      <div className="questions-list">
        <h3>Preguntas ({examData.questions.length})</h3>
        {examData.questions.map((q, index) => (
          <div key={index} className="question-item">
            <p>{q.text} - {q.type} - {q.points} puntos</p>
          </div>
        ))}
      </div>

      <button onClick={submitExam} disabled={examData.questions.length === 0}>
        Crear Examen
      </button>
    </div>
  );
};

export default CreateExam;
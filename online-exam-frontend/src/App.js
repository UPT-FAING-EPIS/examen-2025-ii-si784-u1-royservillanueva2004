import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ExamList from './components/ExamList';
import ExamTaker from './components/ExamTaker';
import CreateExam from './components/CreateExam';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>Plataforma de Exámenes Online</h1>
          <div className="nav-links">
            <Link to="/">Inicio</Link>
            <Link to="/create-exam">Crear Examen</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<ExamList />} />
            <Route path="/exam/:id" element={<ExamTaker />} />
            <Route path="/create-exam" element={<CreateExam />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
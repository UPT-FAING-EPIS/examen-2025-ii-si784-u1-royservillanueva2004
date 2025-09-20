function ExamComponent() {
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    fetchExam();
    startTimer();
  }, []);

  const fetchExam = async () => {
    const response = await axios.get(`/api/exams/${id}`);
    setExam(response.data);
    setTimeLeft(response.data.duration * 60);
  };

  const submitExam = async () => {
    await axios.post('/api/submissions', {
      examId: exam.id,
      answers: answers
    });
  };

  return (
    <div>
      <h2>{exam?.title}</h2>
      <div>Tiempo restante: {formatTime(timeLeft)}</div>
      {exam && (
        <div>
          <h3>{exam.questions[currentQuestion].text}</h3>
          {/* Renderizar preguntas */}
        </div>
      )}
    </div>
  );
}
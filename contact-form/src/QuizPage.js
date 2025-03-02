import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function QuizPage() {
  const [questions] = useState([
    { question: 'What is 2 + 2?', options: ['3', '4', '5'], answer: '4' },
    { question: 'What is the capital of France?', options: ['Paris', 'London', 'Berlin'], answer: 'Paris' },
    { question: 'What is the color of the sky?', options: ['Blue', 'Green', 'Red'], answer: 'Blue' },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [startTime] = useState(new Date());
  const navigate = useNavigate();

  const handleAnswer = (answer) => {
    setUserAnswers([...userAnswers, answer]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const endTime = new Date();
      const timeTaken = Math.round((endTime - startTime) / 1000); // in seconds
      const score = userAnswers.filter((answer, index) => answer === questions[index].answer).length;
      
      // Save score to backend
      const userId = localStorage.getItem('userId');
      axios.post('http://localhost:5000/submit-score', { userId, score, time: timeTaken })
        .then(() => {
          navigate('/result');
        })
        .catch((err) => {
          console.error('Error submitting score:', err);
        });
    }
  };

  return (
    <div className="quiz-container">
      <h2>Question {currentQuestion + 1} of {questions.length}</h2>
      <p>{questions[currentQuestion].question}</p>
      <div>
        {questions[currentQuestion].options.map((option, index) => (
          <button key={index} onClick={() => handleAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizPage;

import React, { useState, useEffect } from 'react';

function ResultPage() {
  const [score, setScore] = useState(null);
  const [time, setTime] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem('username'));

  useEffect(() => {
    const score = localStorage.getItem('score');
    const time = localStorage.getItem('time');
    setScore(score);
    setTime(time);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="result-container">
      <h2>Result</h2>
      <p>Username: {username}</p>
      <p>Score: {score}</p>
      <p>Time taken: {time} seconds</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default ResultPage;

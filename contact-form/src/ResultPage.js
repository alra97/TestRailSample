import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ResultPage() {
  const [score, setScore] = useState(null);
  const [time, setTime] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Guest');
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    // Get score and time from localStorage
    const storedScore = localStorage.getItem('score');
    const storedTime = localStorage.getItem('time');

    // Set state with the retrieved values
    if (storedScore && storedTime) {
      setScore(storedScore);
      setTime(storedTime);
    }

    // Ensure that score, time, and userId exist before sending a request
    if (storedScore && storedTime && userId) {
      const data = {
        userId,
        score: storedScore,
        time: storedTime,
      };

      console.log('Submitting score data:', data);  // Debugging log

      axios
        .post('http://localhost:5000/submit-score', data)
        .then((response) => {
          console.log('Score submitted successfully', response.data);
        })
        .catch((err) => {
          console.error('Error submitting score:', err);
        });
    }
  }, [userId]);  // Re-run the effect when userId changes

  const handleLogout = () => {
    // Clear localStorage and redirect to the home page
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="result-container">
      <h2>Result</h2>
      <p>Username: {username}</p>
      <p>Score: {score !== null ? score : 'N/A'}</p>
      <p>Time taken: {time !== null ? time : 'N/A'} seconds</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default ResultPage;

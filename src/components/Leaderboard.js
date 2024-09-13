import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import './styles/Leaderboard.css'; // Ensure this path is correct

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data from your backend or API
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch('https://json-production-4a9d.up.railway.app/books'); // Replace with your API endpoint
        const data = await response.json();

        // Sort the data by score in decreasing order
        const sortedData = data
          .filter(player => player.score !== undefined) // Ensure we only include players with a score
          .sort((a, b) => b.score - a.score);

        setLeaderboardData(sortedData);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <h1>Leaderboard</h1>
        <div className="leaderboard-list">
          {leaderboardData.length > 0 ? (
            <ul>
              {leaderboardData.map((player, index) => (
                <li key={player.id || index} className="leaderboard-item">
                  <span className="leaderboard-rank">{index + 1}. </span>
                  <span> <td></td><td></td><td></td><td></td><td></td></span>
                  <span className="leaderboard-name">
                    {player.username}
                    {index === 0

                    }
                  </span>
                  <span className="leaderboard-name">
                    {player.rollnum}
                    {index === 0

                    }
                  </span>
                  <span
                    className={`leaderboard-score ${
                      index === 0
                        ? 'first-place'
                        : index === 1
                        ? 'second-place'
                        : index === 2
                        ? 'third-place'
                        : ''
                    }`}
                  >
                    {player.score} units
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading leaderboard data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;




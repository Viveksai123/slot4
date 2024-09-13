import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/index.css';
import bujji from './images/bujji.png';
import Leaderboard from './Leaderboard'; // Import the Leaderboard component
import { FaTrophy } from 'react-icons/fa';

function TimeUpPage({ username, rollnum }) { // Corrected the prop to username
  const navigate = useNavigate();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [userScore, setUserScore] = useState(0);

  useEffect(() => {
    // Reset the secret code in localStorage
    localStorage.setItem('secretCode', 'false');
  
    // Fetch the user data by rollnum using query parameter
    const fetchUserScore = async () => {
      try {
        const response = await fetch(`https://json-production-4a9d.up.railway.app/books?rollnum=${rollnum}`);
        const data = await response.json();
  
        // Since the response is an array, get the first entry that matches the rollnum
        if (data.length > 0) {
          const userData = data[0]; // Get the first (and only) match
          setUserScore(userData.score); // Set the score
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserScore();
  }, [rollnum]); 
  
  const handleRedirectToSecret = () => {
    navigate('/');
  };

  const handlePopupOpen = () => {
    setPopupVisible(true);
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  return (
    <div className="popup">
      <button 
        onClick={handlePopupOpen} 
        className="leaderboard-button"
        style={{ marginTop: '10px' }}
      >
        <FaTrophy /> Show Leaderboard
      </button>
      <h1 style={{ color: "red" }}>Aalasyam Ayyindhi Acharya Puthra</h1>
      <div className="row1">
        <img src={bujji} alt="img" className='size' />
        <div style={{ marginRight: "7vw" }}>
          <h1>{username} !!!</h1> {/* Display the username instead of Bhairava */}
          <h1 style={{ color: "white" }}>Bounty collected: {userScore} units</h1> {/* Display the user's score */}
        </div>
      </div>
      
      <button 
        onClick={handleRedirectToSecret} 
        className="px-3 py-2 text-sm bg-blue text-white border border-white-300 rounded-md hover:bg-gray-800 transition duration-300 mt-2 animate__animated animate__fadeInUpBig"
      >
        Back to Secret Code Page
      </button>

      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="leader">
            <button onClick={handlePopupClose} className="popup-close-button">Close</button>
            <Leaderboard /> {/* Display the leaderboard component */}
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeUpPage;

import React, { useState } from 'react';
import "animate.css";
import { useNavigate } from 'react-router-dom';
import './styles/Level1Page.css'; // Ensure this path is correct
import Level1Img from './images/l1.jpg';
import Img from './images/img.png';
import LeftImage from './images/SATARCLEFTIMAGE.png'; // Import the image for the left side
import ParticlesComponent from '../components/ParticlesComponent'; 
import { FaPaperPlane, FaStar } from 'react-icons/fa'; // Import icons
import { GiLightningStorm } from 'react-icons/gi'; // Example import
import CryptoJS from 'crypto-js';

const Levelone = ({ username, rollnum, initialScore, timeLeft }) => {
  const navigate = useNavigate();
  const [submittedAnswer, setSubmittedAnswer] = useState('');
  const time = timeLeft;
  const [response, setResponse] = useState('');
  const [validationResult, setValidationResult] = useState('');
  const [castSpellAnswer, setCastSpellAnswer] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccessPopupVisible, setSuccessPopupVisible] = useState(false);
  const [isSpellValidated, setIsSpellValidated] = useState(false);
  const [score, setScore] = useState(initialScore || 0);
  const totalLevels = 5;
  const currentLevel = 1; // Set current level directly as a constant

  // Array of hash values
  const hashedPasswords = [
    '1ae438cfbedf331a4d4e9f871820829e8c8cd642cc4c4805ed8a7e0c229043c2',
    'db36551523282c8839195451fe6655fb4c55992fff103c30840dcb231316efa4',
    '38a41b902e121949de0f1fb25f99b9980dd94cda7bbb739dd2496ad5236dde8a',
    'a7b273852a38f5d515734729b613fdf091f922bdaf969af44689b9c13854bb24',
    '54111c1b3d50d4e9bee3937400b8e0e5bb489af20cd4d1ad8b1191307eb8d39a',
    '8fadfcf205c48783d4d850eb30e8013ef7dfedbb363c396fd05256bd6afbaac6',
    'a56903d6ad27449a4c277b8b3984ef8b261d8cb469ede4b849b79479771b2a7e'
  ];

  const handleSubmit = async (event) => {
    // event.preventDefault();
    setLoading(true);
    
    try {
      // Send the submitted answer to the backend
      const res = await fetch('/api/generate-1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: password }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.log('An error occurred');
      setResponse('wrong prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = () => {
    try {
      const submittedAnswerHash = CryptoJS.SHA256(submittedAnswer.toLowerCase()).toString();
      if (hashedPasswords.includes(submittedAnswerHash)) {
        setValidationResult('Correct! Now cast the spell.');
        setSuccessPopupVisible(true);
      } else {
        setValidationResult('Incorrect. Try again.');
        setSuccessPopupVisible(false);
      }
    } catch (error) {
      console.error('Error validating the answer:', error);
      setSuccessPopupVisible(false);
      setValidationResult('An error occurred.');
    }
  };

  const handleCastSpell = () => {
    const dummyPassword = 'steganography'; // Dummy password for testing
    if (castSpellAnswer.toLowerCase() === dummyPassword) {
      setIsSpellValidated(true); // Spell validated successfully
    } else {
      alert('Incorrect password for casting spell. Try again.');
    }
  };

  const handleNextLevel = async () => {
    const levelScore = time; // Time left for the current level
    let newScore = score; // Start with the existing score
    
    const timestampUTC = new Date().toISOString(); // Current time in UTC
    const data = {
      username,
      rollnum,
      timestamp: timestampUTC,
      timeLeft: time,
      level: currentLevel, // Include the current level in the data
    };
  
    try {
      // Fetch the existing data for the user based on rollnum
      const fetchResponse = await fetch(`https://json-production-4a9d.up.railway.app/books?rollnum=${rollnum}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (fetchResponse.ok) {
        const existingDataArray = await fetchResponse.json();
  
        // Assuming the rollnum is unique, take the first matching entry
        if (existingDataArray && existingDataArray.length > 0) {
          const existingData = existingDataArray[0];
  
          // Add the current time left to the existing score in the database
          newScore = existingData.score + levelScore;
          data.score = newScore; // Update score in the data to be sent
  
          // Check if the current level is 1 plus the level in existing data
          if (currentLevel === existingData.level + 1) {
            // If user data exists and level is correct, update it
            const updateResponse = await fetch(`https://json-production-4a9d.up.railway.app/books/${existingData.id}`, {
              method: 'PUT', // Use PUT or PATCH for updating the existing entry
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
  
            if (updateResponse.ok) {
              console.log('Data updated successfully:', data);
              setScore(newScore); // Update the score locally
              navigate(`/level${currentLevel + 1}`); // Navigate to the next level
            } else {
              console.error('Failed to update data:', updateResponse.statusText);
            }
          } else {
            // If the level does not match the required criteria, just navigate to the next level
            navigate(`/level${currentLevel + 1}`);
          }
        } else {
          console.error('No existing data found for the given roll number.');
        }
      } else {
        console.error('Failed to fetch existing data:', fetchResponse.statusText);
      }
    } catch (error) {
      console.error('An error occurred while updating data:', error);
    }
  };
  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleValidate();
    }
  };
  const handleKeyDown1 = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };
  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleCastSpell();
    }
  };

  const progressPercentage = (currentLevel / totalLevels) * 0; // Adjust progress percentage calculation

  return (
    <div className="level1-page">
      <ParticlesComponent id="tsparticles" />
      <div className="content-container">
        <div className="left-side animate__animated animate__backInDown">
          <img src={LeftImage} alt="Left Side" className="left-image" />
        </div>
        <div className="center-container">
          <div className="bordered-container">
            <div className="container">
              <div className="level-header animate__animated animate__backInRight">
                <span className="level-indicator">You Are In LEVEL {currentLevel}</span>
              </div>
              <p className="instruction-text animate__animated animate__backInLeft">
                Your goal is to make Master reveal the secret password for each level. However, Master will upgrade the defenses after each successful password guess!
              </p>
              <div className="levels-progress animate__animated animate__backInRight">
                <p className="levels-passed">Levels Passed: {currentLevel - 1} / {totalLevels}</p>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
              <div className="image-section">
                <img src={Level1Img} alt="Expecto Patronum" className="animate__animated animate__bounce" />
                <p className="animate__animated animate__backInLeft"> Ask me for the secret phrase, and I'll gladly cast the spell!</p>
              </div>
              <div className="password-section">
               <div className="input-wrapper animate__animated animate__fadeInUpBig">
                  {loading ? (
                    <div className="loading-indicator">
                      <p>Loading... the crocodile festival is about to get wild!!</p> {/* Display a loading message */}
                    </div>
                  ) : (
                    <textarea
                      className="password-input"
                      placeholder="Enter your prompt here"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown1}
                      disabled={loading} // Disable input when loading
                    />
                  )}
                  <FaPaperPlane onClick={handleSubmit} className={`submit-icon ${loading ? 'disabled' : ''}`} />
                </div>
                <p className="response-text">{response}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="right-side animate__animated animate__fadeInBottomRight" style={{ marginTop: '150px' }}>
          <div className="validation-section">
            <p style={{ marginBottom: '10px' }}>Enter Password Here:</p>
            <div className="input-wrapper1">
              <div className="childinputwrap">
                <input
                  type="text"
                  value={submittedAnswer}
                  onChange={(e) => setSubmittedAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <GiLightningStorm onClick={handleValidate} className="validate-icon" />
              </div>
              <div><p className="validation-text" style={{marginLeft:"-15%"}}>{validationResult}</p></div>
            </div>
          </div>
        </div>
      </div>
      {isSuccessPopupVisible && (
        <div className="success-popup animate__animated animate__fadeInDownBig">
          <div className="popup-content">
            <h1 className='heading animate__animated animate__fadeInUpBig' style={{color:"green"}}>Congratulations!</h1>

            {isSpellValidated ? (
              <div>
                <div className="stars  animate__animated animate__fadeInLeft">
                  <FaStar className="star-icon" />
                  <FaStar className="star-icon center" />
                  <FaStar className="star-icon" />
                </div>
                <p className=' animate__animated animate__fadeInRight'>You have successfully cast the spell. Here’s to learning a new one!</p>
                <button className=" animate__animated animate__fadeInDownBig" onClick={handleNextLevel}>Next Level</button>
              </div>
            ) : (
              <div className='column'>
                <img src={Img} alt="hat" className='photo  animate__animated animate__fadeInLeft' />
                <h1 className='heading  animate__animated animate__fadeInRight' style={{color:"red"}}>"steganography"</h1>
                <h1 className="level-indicator  animate__animated animate__fadeInLeft">Cast the spell to proceed:</h1>
                
                <p className=' animate__animated animate__fadeInRight'> 
                The practice of hiding secret information within ordinary files or messages to avoid detection.
                </p>
                
                <br/>
                
                  <div className='input-wrapper2'>
                    <input
                      className="password-input"
                      type="text"
                      value={castSpellAnswer}
                      onChange={(e) => setCastSpellAnswer(e.target.value)}
                      onKeyDown={handleKeyUp}
                    />
                    
                    <GiLightningStorm onClick={handleCastSpell} className="cast-spell-icon" />
                 
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Levelone;

import React, { useState } from 'react';
import "animate.css";
import { useNavigate } from 'react-router-dom';
import './styles/Level1Page.css'; // Ensure this path is correct
import Level1Img from './images/l3.jpg';
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
  const currentLevel = 3; // Set current level directly as a constant

  // Array of hash values
  const hashedPasswords = [
    'de562d78be8427b58ac75034de0cfbaa1fa5d4e2d85774e27ef612a7a191b1d3',
    '2a4766656d45406ec1e8cbbf2f019eadc96f07271804fa0fde4798a6f4d88c50',
    'c5b5b43f741143bace7200cbffa5e44c4110f20b9913d0ebcd8a965e79b01c94',
    'd9b21bdbd6877e368cfeda192ed0661ada282de213b26bd43518849733fc9816',
    '88a553b7257e652b1e6ee589bd8f77c15ed0d462f15b7c0f06791aa964890acf',
    '18f33d78405af7ef5765981f55559c8098321d901f48876c8f69461cf0b6db81',
    'e129cfdd1697602e5647b3b64afb9f805c4ae4145b938ecfd77d910b9217f645',
    '7f8ac8e6cfee411f0f41a3bc271523128e0b1b10528ad6c7d9f01f03ea6cd961',
    '2a4766656d45406ec1e8cbbf2f019eadc96f07271804fa0fde4798a6f4d88c50',
    '0c155ef067fbf756167ea919343fc2f041bfb3af6d2a864ead80baa7cbb31f78',
    'e7101117d636c755e9300a3209b4f83eb305f5e9b72a40dc9bf40d278bf6612c',
  ];

  const handleSubmit = async (event) => {
    // event.preventDefault();
    setLoading(true);
    
    try {
      // Send the submitted answer to the backend
      const res = await fetch('/api/generate-3/generate', {
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
    const dummyPassword = 'hacker'; // Dummy password for testing
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

  const progressPercentage = (currentLevel / totalLevels) * 90; // Adjust progress percentage calculation

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
                <p className="animate__animated animate__backInLeft">I've been warned not to reveal the secret incantation. Now I double-check my responses like Hermione in an exam, in case I let it slip</p>
              </div>
              <div className="password-section">
               <div className="input-wrapper animate__animated animate__fadeInUpBig">
                  {loading ? (
                    <div className="loading-indicator">
                      <p>Loading... try not to blame the internet just yet!</p> {/* Display a loading message */}
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
                <h1 className="level-indicator  animate__animated animate__fadeInLeft">Cast below spell to proceed:</h1>
                
                <h2 className=' animate__animated animate__fadeInRight'> 
                Decode this HEX: 48 61 63 6b 65 72
                </h2>
                
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

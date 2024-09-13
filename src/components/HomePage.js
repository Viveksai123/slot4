import React from 'react';
import 'animate.css';
import './home.css';
import { useNavigate } from 'react-router-dom';
import './styles/App.css';
import harryPotterImg from './images/Harry.png';
import LeftImage from './images/first.png';

const HomePage = () => {
  const navigate = useNavigate(); // Using useNavigate hook

  const handleClick = () => {
    navigate('/rules'); // Navigate to /rules on button click
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center animate__animated animate__fadeIn"
      style={{ backgroundImage: `url(${harryPotterImg})` }} // Set the background image for the div
    >
      {/* Centered image and button */}
      <div className="absolute left-[calc(50%+220px)] top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        {/* Left image with animation */}
        <div

         
          className="animate__animated animate__fadeInTopRight bg-cover"
        >
          <img src={LeftImage} alt="LeftImage" />

        </div>
        {/* Button for navigation */}
        <button
          onClick={handleClick}
          
          className="px-3 py-2 text-sm bg-blue text-white border border-white-300 rounded-md hover:bg-gray-800 transition duration-300 ml-[-25] mt-2 animate__animated animate__fadeInUpBig"
        >
          Wanna Meet Harry?
        </button>
      </div>
    </div>
  );
};

export default HomePage;

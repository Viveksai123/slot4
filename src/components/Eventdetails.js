import React from 'react'
import 'animate.css/animate.min.css';
import { Link } from 'react-router-dom';

const Eventdetails = () => {
    const currentDate = new Date().toLocaleDateString();

  return (
    <div className="event-details animate__animated animate__fadeInDownBig" style={{ fontSize: "40px" }}>
      <div className='row animate__animated animate__fadeInTopLeft'>
        <img src="./image.png" alt="logo" className="elogo1" />
        <p style={{ color: "white" }}>Challenge</p>
      </div>
      <p className="event-description typewriter">Join us for an exciting event focused on <span style={{ color: "white" }}>prompt engineering</span>.<br /> Challenge yourself and compete with others!</p>
      <p className="event-date">Date: {currentDate}</p>
      <p className="event-location">Location: Online</p>
      <Link to="/register">
        <button className="enter-event-button animate__animated animate__fadeInUpBig">Enter Event</button>
      </Link>
    </div>
  )
}

export default Eventdetails

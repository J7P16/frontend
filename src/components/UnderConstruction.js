import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UnderConstruction.css';

const UnderConstruction = () => {
  const navigate = useNavigate();

  return (
    <div class="uc-container">
      <div class="uc-banner">
        <h1>Under Construction</h1>
        <h3>
          We’re building something amazing, but it’s not quite ready yet.  
          In the meantime, take a deep breath and remember that even the best startups take time to build. We promise it’ll be worth the wait.
        </h3>
        <a href="/" onClick={(e) => {e.preventDefault(); navigate('/');}}>Go to Homepage</a>
        <br></br>
      </div>
    </div>
  );
};

export default UnderConstruction;
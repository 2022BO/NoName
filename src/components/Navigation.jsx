import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Navigation = () => {
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    background: 'linear-gradient(to left, #3498db, #2ecc71)', 
    padding: '10px',
  };

  const linkStyle = {
    color: 'green',
    textDecoration: 'none',
  };

  const buttonStyle = {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: 'green',
    textDecoration: 'none',
    fontSize: 20,
    fontWeight: 'bold',
  };

  const navigate = useNavigate();

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>
        Cursuscatalogus
      </Link>
      <Link to="/event/:eventId" style={{ ...linkStyle, marginLeft: '20px' }}>
        Cursus toevoegen
      </Link>
    </nav>
  );
};


import React from 'react';
import { Link } from 'react-router-dom';


export const Navigation = ({ courseId}) => {
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    background: 'linear-gradient(to left, #3498db, #2ecc71)',
    padding: '10px',
    borderRadius: '3px',
  };

  const linkStyle = {
    color: 'green',
    textDecoration: 'none',
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ ...linkStyle,}}>
        Cursuscatalogus
      </Link>
<Link to={`/course/${courseId || 'fallbackId'}`} style={{ ...linkStyle, marginLeft: '20px' }}>
  Cursus Aanmelden
</Link>
      <Link to="/information-and-contact" style={{ ...linkStyle, marginLeft: '20px' }}>
      Informatie & contact
      </Link>
    </nav>
  );
};


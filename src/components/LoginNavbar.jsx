import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import twitterLogo from '../Images/logo.png';
import './StylesFolder/Navbar.css';

const LoginNavbar = ({ loading }) => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="navbar-left">
            {/* Add content for navbar-left if needed */}
          </div>
          <div className="navbar-center">
            <Link to="/" className="logo-link">
              <img
                src={twitterLogo}
                alt="Twitter Logo"
                className="twitter-logo"
              />
            </Link>
          </div>
          <div className="navbar-right">
            <Link to="/login" className="nav-link" onClick={() => navigate('/login')}>
              Login
            </Link>
            <Link to="/signup" className="nav-link" onClick={() => navigate('/signup')}>
              Signup
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginNavbar;

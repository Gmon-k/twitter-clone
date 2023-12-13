// NavBar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import twitterLogo from '../Images/logo.png';

import './StylesFolder/Navbar.css';

import { useParams} from 'react-router-dom';

const NavBar = () => {
  const { username } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      const isLoggedInResponse = await axios.get('/api/user/isLoggedIn');
      const loggedInUsername = isLoggedInResponse.data.username;

      if (!isLoggedInResponse.data.isLoggedIn) {
        // If the user is not logged in, redirect to the login page or handle as needed
        navigate('/login');
        return;
      }

      setLoggedInUser(loggedInUsername);
      try {
        const response = await axios.get(`/api/user/getUserDetails/${loggedInUser}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [loggedInUser]); 

  async function logOut() {
    try {
      await axios.post('/api/user/logout', {});
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
  
  // The empty dependency array ensures that the effect runs only once on mount

  return (
    <div className="navbar">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="navbar-left">
            <div className="navbar-profile-info">
              <img
                src={`data:image/png;base64,${userDetails.profilePic}`}
                alt="Profile Pic"
                className="profile-pic-navbar"
              />
              <span className="username">{userDetails.username}</span>
            </div>
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
            <Link to= {`/home/${loggedInUser}`} className="nav-link" onClick={() => navigate(`/home/${loggedInUser}`)}>
              Home
            </Link>
            <Link to={`/profile/${loggedInUser}`} className="nav-link" onClick={() => navigate(`/profile/${loggedInUser}`)}>
            Profile
            </Link>

            <Link to="/logout" className="nav-link" onClick={logOut}>
              Logout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default NavBar;

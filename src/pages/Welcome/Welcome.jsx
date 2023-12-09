import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

import NavBar from '../../components/Navbar';

import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();

  const [userName, setUsername] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [newBio, setNewBio] = useState('');
  const [imageFile, setImageFile] = useState(null);
  

  async function updateDetails() {
    try {
      const formData = new FormData();
      formData.append('bio', newBio);
      formData.append('profilePic', imageFile || '');

      await axios.post('/api/user/updateUserDetails', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      getUserDetails();
      window.location.reload();
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  }

  async function getUsername() {
    try {
      const response = await axios.get('/api/user/isLoggedIn');

      if (response.data.username) {
        setUsername(response.data.username);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async function getUserDetails() {
    try {
      const response = await axios.get('/api/user/getUserDetails');

      if (response.status === 200) {
        setUserDetails(response.data);
      } else {
        console.error('Failed to retrieve user details:', response.data.error);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  }

  useEffect(() => {
    getUsername();
    getUserDetails();
  }, []);

  async function logOut() {
    try {
      await axios.post('/api/user/logout', {});
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }



  return (
    <div>
      <NavBar />
      <div className="container">
        <div className="left-panel">

          <div>
          <img
            src={`data:image/png;base64,${userDetails.profilePic}`}
            alt="Profile Pic"
            style={{width: '120px',height: '120px', objectFit: 'cover',borderRadius: '50%', 
            }}
          />
          <h2>Welcome {userDetails.username}</h2>
          <h3>
            <p>First Name: {userDetails.firstName}</p>
            <p>Last Name: {userDetails.lastName}</p>
            <p>Joined on: {new Date(userDetails.createdTime).toLocaleString()}</p>
            <p>Bio: {userDetails.bio}</p>
          </h3>
          </div>
        </div>
        <div className="right-panel">
          <div className="update-section">
            <h2>Update Bio and Profile Pic</h2><br></br><br></br>
            <label>
              Bio:
              <input type="text" value={newBio} onChange={(e) => setNewBio(e.target.value)} />
            </label>
            <label>
              Profile Pic:
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </label>
            <button onClick={updateDetails}>Update Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Welcome;

import React from 'react'
import './Profile.css';
import NavBar from '../../components/Navbar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';



function Profile() {
    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useState({});
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get('/api/user/getUserDetails');
          setUserDetails(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserDetails();
    }, []); 

  return (
    <div className='profile-container'>
      <NavBar />
      <div className='container-split'>

      <div className='left-panel-profile'>

    <div className='white-box'>
        <img className="oval-image" 
        src={`data:image/png;base64,${userDetails.profilePic}`}
        alt="Oval"/>
        <div classname="profile-text-content">
            <h3>{userDetails.firstName} {userDetails.lastName}</h3>
            <h3>Joined on {new Date(userDetails.createdTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</h3>
            <h3>{userDetails.bio}</h3>
            <button className="button-profile" onClick={() => navigate('/setting')}>Edit Profile</button>

        </div>
    </div>
        

      </div>


      <div className='right-panel-profile'>
         <div className='white-box'>

                heelo
        </div>
      </div>

      </div>

    </div>
  );
}

export default Profile
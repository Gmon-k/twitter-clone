import React, { useState, useEffect } from 'react';
import './Profile.css';
import NavBar from '../../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
//pages for the profile of the each user
function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [tweets, setTweets] = useState([]);
  const [updateTweetStates, setUpdateTweetStates] = useState({});
  const [loggedInUser, setLoggedInUser] = useState({});
  useEffect(() => {
    const fetchUserDetails = async () => { //fucntion fetch user details
      const isLoggedInResponse = await axios.get('/api/user/isLoggedIn');
      const loggedInUsername = isLoggedInResponse.data.username;
  
      setLoggedInUser(loggedInUsername);
      if (!username) {
        navigate('/home');
        return;
      }
      try {
        const response = await axios.get(`/api/user/getUserDetails/${username}`);
        setUserDetails(response.data);

        const tweetResponse = await axios.get(`/api/tweet/getTweetsByUsername/${username}`);
        const sortedTweets = tweetResponse.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setTweets(sortedTweets);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
    console.log('logged in as:', loggedInUser)
  }, [username, loggedInUser, navigate]);

  if (!userDetails.username) {      //function to check the user details
    console.log('User details not yet populated');
    return <div>Loading...</div>;
  }
   //function to format the time stamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const formattedTimestamp = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${hours >= 12 ? 'pm' : 'am'
      } ${day} ${month} ${year}`;
    return formattedTimestamp;
  };
  //function to delete the tweet
  const deleteTweet = async (tweetId) => {
    try {
      await axios.delete(`/api/tweet/deleteTweet/${tweetId}`);
      const tweetResponse = await axios.get(`/api/tweet/getTweetsByUsername/${userDetails.username}`);
      const sortedTweets = tweetResponse.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setTweets(sortedTweets);
    } catch (error) {
      console.error('Error deleting tweet:', error);
    }
  };
  //function to open the update form
  const openUpdateForm = (tweetId, tweetText) => {
    setUpdateTweetStates((prevStates) => ({
      ...prevStates,
      [tweetId]: { isOpen: true, tweetText, tweetImage: null },
    }));
  };
  //function to close the update form 
  const closeUpdateForm = (tweetId) => {
    setUpdateTweetStates((prevStates) => ({
      ...prevStates,
      [tweetId]: { isOpen: false, tweetText: "", tweetImage: null },
    }));
  };
  //function to submit update form 
  const submitUpdateForm = async (tweetId) => {
    try {
      const formData = new FormData();
      formData.append("tweet", updateTweetStates[tweetId].tweetText);
      formData.append("postimage", updateTweetStates[tweetId].tweetImage);
      const response = await axios.put(`/api/tweet/updateTweet/${tweetId}`, formData);
      closeUpdateForm(tweetId);
      const updatedTweets = tweets.map((t) =>
        t._id === tweetId
          ? { ...t, tweet: updateTweetStates[tweetId].tweetText, postimage: response.data.postimage }
          : t
      );
      setTweets(updatedTweets);
    } catch (error) {
      console.error('Error updating tweet:', error);
    }
  };
  //HTML side of the page
  return (
    <div className='profile-container'>
      <NavBar />
      <div className='container-split'>
        <div className='left-panel-profile'>
          <div className='white-box'>
            <img className="oval-image" src={`data:image/png;base64,${userDetails.profilePic}`} alt="Oval" />
            <div className="profile-text-content">
              <h3>{userDetails.firstName} {userDetails.lastName}</h3>
              <h3>Joined on {new Date(userDetails.createdTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</h3>
              <h3>{userDetails.bio}</h3>
              {loggedInUser === username && (
                <button className="button-profile" onClick={() => navigate(`/setting/${username}`)}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className='right-panel-profile'>
          <div>
            <ul>
              {tweets.map((tweet) => (
                <div key={tweet._id} className='white-box'>
                  <p>
                    <img className="oval-image-tweet" src={`data:image/png;base64,${userDetails.profilePic}`} alt="Oval" />
                    <b>  {userDetails.firstName}  {userDetails.lastName}</b>
                  </p>
                  <p>{tweet.tweet}</p>
                  {tweet.postimage != null && (
                    <img className="post-image-tweet" src={`data:image/png;base64,${tweet.postimage}`} alt='Post' />
                  )}
                  <p className='timestamp-tweet'>{formatTimestamp(tweet.timestamp)}</p>
                  {loggedInUser === username && (
                    <div>
                      <button className="button-update-profile" onClick={() => deleteTweet(tweet._id)}>
                        Delete
                      </button>
                      <button className="button-update-profile" onClick={() => openUpdateForm(tweet._id, tweet.tweet)}>
                        Edit
                      </button>
                    </div>
                  )}
                  {updateTweetStates[tweet._id] && updateTweetStates[tweet._id].isOpen && (
                    <div className="update-form">
                      <textarea
                        value={updateTweetStates[tweet._id].tweetText}
                        onChange={(e) => setUpdateTweetStates((prevStates) => ({
                          ...prevStates,
                          [tweet._id]: { ...prevStates[tweet._id], tweetText: e.target.value },
                        }))}
                        placeholder="Enter updated tweet text"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUpdateTweetStates((prevStates) => ({
                          ...prevStates,
                          [tweet._id]: { ...prevStates[tweet._id], tweetImage: e.target.files[0] },
                        }))}
                      />
                      <button className="button-update-profile" onClick={() => submitUpdateForm(tweet._id)}>Update Tweet</button>
                      <button className="button-update-profile" onClick={() => closeUpdateForm(tweet._id)}>Cancel</button>
                    </div>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>



      </div>
    </div>
  );
}

export default Profile;

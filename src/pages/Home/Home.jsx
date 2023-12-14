import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../../components/Navbar';
import Tweet from '../../components/Tweet';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './Home.css';
import { useNavigate } from 'react-router-dom';
//pages for the home
function Home() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]); //use state for tweets
  const [userDetails, setUserDetails] = useState({}); //use state for userdetails
  const [updateTweetStates, setUpdateTweetStates] = useState({}); //use state for updating tweet
  const [loggedInUser, setLoggedInUser] = useState({}); //usestate for loggedinuser
  useEffect(() => {
    const fetchUserDetails = async () => {  //function fetch details
      const isLoggedInResponse = await axios.get('/api/user/isLoggedIn');
      const loggedInUsername = isLoggedInResponse.data.username;
      if (!isLoggedInResponse.data.isLoggedIn) { //check if it is a logged in response
        navigate('/login');
        return;
      }
      setLoggedInUser(loggedInUsername);
      if (!username) {
        navigate('/home');
        return;
      }
      try {
        const response = await axios.get(`/api/user/getUserDetails/${username}`);
        setUserDetails(response.data);
        const tweetResponse = await axios.get(`/api/tweet/getAllTweets`);
        const sortedTweets = tweetResponse.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setTweets(sortedTweets);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
    //function  to fetch all the tweets
    const fetchAllTweets = async () => {
      try {
        const userResponse = await axios.get(`/api/user/getUserDetails/${username}`);
        setUserDetails(userResponse.data);
        const tweetResponse = await axios.get('/api/tweet/getAllTweets');
        const sortedTweets = tweetResponse.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setTweets(sortedTweets);
      } catch (error) {
        console.error('Error fetching tweets:', error);
      }
    };
    fetchAllTweets();
  }, [username, loggedInUser, navigate]);
  //function to format the timestamp
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
 //function to delete tweet
  const deleteTweet = async (tweetId) => {
    try {
      await axios.delete(`/api/tweet/deleteTweet/${tweetId}`);
      const tweetResponse = await axios.get(`/api/tweet/getAllTweets`);
      const sortedTweets = tweetResponse.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setTweets(sortedTweets);
    } catch (error) {
      console.error('Error deleting tweet:', error);
    }
  };
 //function to open a form updating the tweet
  const openUpdateForm = (tweetId, tweetText) => {
    setUpdateTweetStates((prevStates) => ({
      ...prevStates,
      [tweetId]: { isOpen: true, tweetText, tweetImage: null },
    }));
  };
//function to close update form
  const closeUpdateForm = (tweetId) => {
    setUpdateTweetStates((prevStates) => ({
      ...prevStates,
      [tweetId]: { isOpen: false, tweetText: "", tweetImage: null },
    }));
  };
  //function to submit the form
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
 //HTML side of the home page
  return (
    <div>
      <NavBar />
      <div className="home-container">
        <div >
          <div className='white-box-home'><Tweet /></div>
          <div className="tweets-container"> 
            {tweets.map((tweet) => (
              <div key={tweet._id} className='tweet-box-home'>
                <p>
                  <Link to={`/profile/${tweet.username}`}>
                    <b> {tweet.username}</b>
                  </Link>
                </p>
                <p>{tweet.tweet}</p>
                {tweet.postimage != null && (
                  <img className="post-image-tweet" src={`data:image/png;base64,${tweet.postimage}`} alt='Post' />
                )}
                <p className='timestamp-tweet'>{formatTimestamp(tweet.timestamp)}</p>
                {loggedInUser === tweet.username && (
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

          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;

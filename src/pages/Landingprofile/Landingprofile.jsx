import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import LoginNavbar from '../../components/LoginNavbar';
import axios from 'axios';
//Page for loading all the tweet and user details before login in 
function Landingprofile() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({});
    const [tweets, setTweets] = useState([]);
    useEffect(() => {
        const fetchUserDetails = async () => { //fucntion fetch user details and tweets
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
    }, [username, navigate]);
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
    //HTML rendering of the page
    return (
        <div>
            <div>< LoginNavbar /></div>
            <div className='container-split'>
                <div className='left-panel-profile'>
                    <div className='white-box'>
                        <img className="oval-image" src={`data:image/png;base64,${userDetails.profilePic}`} alt="Oval" />
                        <div className="profile-text-content">
                            <h3>{userDetails.firstName} {userDetails.lastName}</h3>
                            <h3>Joined on {new Date(userDetails.createdTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</h3>
                            <h3>{userDetails.bio}</h3>
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
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Landingprofile
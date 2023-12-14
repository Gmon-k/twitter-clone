import React, { useState, useEffect } from 'react';
import LoginNavbar from '../../components/LoginNavbar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function Landingpage() {

//function for loading all the tweets even when the user isn't signed in
    const [tweets, setTweets] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchAllTweets = async () => {  //function to fetch all the tweet and display it
            try {
                const tweetResponse = await axios.get('/api/tweet/getAllTweets');
                const sortedTweets = tweetResponse.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setTweets(sortedTweets);
            } catch (error) {
                console.error('Error fetching tweets:', error);
            }
        };

        fetchAllTweets();
    }, []);
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
            <div><LoginNavbar /></div>
            <div className="home-container">
                <div className="tweets-container">
                    <div>
                        {tweets.map((tweet) => (
                            <div key={tweet._id} className='tweet-box-home'>
                                <p>
                                    <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/Landingprofile/${tweet.username}`)}
                                    >                    {tweet.username}
                                    </span>
                                </p>
                                <p>{tweet.tweet}</p>
                                {tweet.postimage != null && (
                                    <img className="post-image-tweet" src={`data:image/png;base64,${tweet.postimage}`} alt='Post' />
                                )}
                                <p className='timestamp-tweet'>{formatTimestamp(tweet.timestamp)}</p>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landingpage
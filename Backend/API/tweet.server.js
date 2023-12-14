const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const TweetAccessor = require('../Databases/tweet.model');
const fs = require('fs');
//api call for inserting the tweet
router.post('/insertTweet', upload.single('postimage'), async function (request, response) {
  console.log('Request Body:', request.body);
  const body = request.body;
  const tweet = body.tweet;
  const username = body.username;
  let imageBase64;
  if (request.file) {
    try {
      // Convert the image to base64
      imageBase64 = fs.readFileSync(request.file.path, { encoding: 'base64' });
      fs.unlinkSync(request.file.path);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Error processing the uploaded image" });
      return;
    }
  }
  if (!username || !tweet) {
    response.status(400).json({ error: "Incomplete request" });
    return;
  }

  try {
    // Insert new tweet
    const newTweet = {
      username: username,
      tweet: tweet,
      postimage: imageBase64,
    };

    console.log(newTweet);

    await TweetAccessor.insertTweet(newTweet);
    response.status(201).json({ message: "Tweet successfully created" });

  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});


// API to Get Tweets by Username
router.get('/getTweetsByUsername/:username', async function (request, response) {
  const username = request.params.username;

  if (!username) {
    response.status(400).json({ error: "Incomplete request" });
    return;
  }

  try {
    const tweets = await TweetAccessor.getTweetByUsername(username);

    response.status(200).json(tweets);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// API to Get All Tweets
router.get('/getAllTweets', async function (request, response) {
  try {
    const tweets = await TweetAccessor.getAllTweets();

    response.status(200).json(tweets);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// API to Delete a Tweet by ID
router.delete('/deleteTweet/:tweetId', async function (request, response) {
  const tweetId = request.params.tweetId;

  if (!tweetId) {
    response.status(400).json({ error: "Incomplete request" });
    return;
  }

  try {
    await TweetAccessor.deleteTweet(tweetId);
    response.status(200).json({ message: "Tweet successfully deleted" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// API to Update a Tweet by ID
router.put('/updateTweet/:tweetId', upload.single('postimage'), async function (request, response) {
  const tweetId = request.params.tweetId;
  const updateData = request.body;
  let imageBase64;
  if (request.file) {
    try {
      // Convert the image to base64
      imageBase64 = fs.readFileSync(request.file.path, { encoding: 'base64' });
      fs.unlinkSync(request.file.path);
      updateData.postimage = imageBase64;
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Error processing the uploaded image" });
      return;
    }
  }

  if (!tweetId || !updateData) {
    response.status(400).json({ error: "Incomplete request" });
    return;
  }

  try {
    // Update the tweet
    const updatedTweet = await TweetAccessor.updateTweet(tweetId, updateData);
    response.status(200).json(updatedTweet);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;


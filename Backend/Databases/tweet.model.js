const mongoose = require("mongoose")

const TweetSchema = require('./tweet.schema').TweetSchema

const TweetModel = mongoose.model("Tweet", TweetSchema);



function insertTweet(newTweet) {
    return TweetModel.create(newTweet);
}

function getTweetByUsername(username) {
    return TweetModel.find({username: username}).exec();
}

function updateTweet(tweetId, updateData) {
    // Assuming you have an update function in TweetAccessor
    return TweetModel.findByIdAndUpdate(tweetId, { $set: updateData }, { new: true }).exec();
}

function deleteTweet(tweetId) {
    return TweetModel.findByIdAndDelete(tweetId).exec();
}

function getAllTweets() {
    return TweetModel.find({}).exec();
}


module.exports = {
    insertTweet,
    getTweetByUsername,
    getAllTweets,
    updateTweet,
    deleteTweet
};
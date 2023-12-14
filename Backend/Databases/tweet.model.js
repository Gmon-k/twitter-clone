const mongoose = require("mongoose")
const TweetSchema = require('./tweet.schema').TweetSchema
const TweetModel = mongoose.model("Tweet", TweetSchema);
//function to insert tweet
function insertTweet(newTweet) {
    return TweetModel.create(newTweet);
}
//function to get tweet by username
function getTweetByUsername(username) {
    return TweetModel.find({username: username}).exec();
}
//function to delete tweet
function updateTweet(tweetId, updateData) {
    return TweetModel.findByIdAndUpdate(tweetId, { $set: updateData }, { new: true }).exec();
}
//function to delete tweets
function deleteTweet(tweetId) {
    return TweetModel.findByIdAndDelete(tweetId).exec();
}
//function to get all tweets
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
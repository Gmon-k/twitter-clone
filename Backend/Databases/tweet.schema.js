const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//scehma for tweets
exports.TweetSchema = new Schema({
    username: String,
    tweet: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
    postimage: String,
}, { collection : 'TweetTable' });
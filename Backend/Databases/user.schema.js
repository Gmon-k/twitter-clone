const Schema = require('mongoose').Schema;

exports.UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    firstName: String, 
    lastName: String, 
 
    createdTime: {
        type: Date,
        default: Date.now,
    },
    bio: String,
    profilePic: String,
}, { collection: 'userTable' });


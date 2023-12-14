const mongoose = require("mongoose")
const UserSchema = require('./user.schema').UserSchema
const UserModel = mongoose.model("UserSchema", UserSchema);
//function to insert user
function insertUser(user) {
    return UserModel.create(user);
}
//function to get user by username
function getUserByUsername(username) {
    return UserModel.findOne({username: username}).exec();
}
module.exports = {
    insertUser,
    getUserByUsername,
};
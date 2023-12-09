const mongoose = require("mongoose")

const UserSchema = require('./user.schema').UserSchema

const UserModel = mongoose.model("UserSchema", UserSchema);

function insertUser(user) {
    return UserModel.create(user);
}

function getUserByUsername(username) {
    return UserModel.findOne({username: username}).exec();
}

module.exports = {
    insertUser,
    getUserByUsername,
};
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: { type: String, require: true, unique: true },
    title: String,
    marriage: {
        uid: String,
        date: Number,
        ring: String,
        status: String
    },
    bio: String,
    money: Number,
    codesRedeemed: [String],
    cooldowns: [{
        cmd: String,
        date: Number
    }],
    awards: [String]
    

});

const User = mongoose.model("user", userSchema);
module.exports = User;
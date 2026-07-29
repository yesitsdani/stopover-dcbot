const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: { type: String, require: true, unique: true },
    marriage: {
        uid: String,
        date: Number
    },
    money: Number,
    codesRedeemed: [String],
    

});

const User = mongoose.model("user", userSchema);
module.exports = User;
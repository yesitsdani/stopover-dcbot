const mongoose = require('mongoose');

const inventoryScema = new mongoose.Schema({
    uid: { type: String, require: true, unique: true },
    marriage: {
        uid: String,
        date: Number
    },
    money: Number,
    codesRedeemed: [String],
    

});

const Inv = mongoose.model("user", inventoryScema);
module.exports = Inv;
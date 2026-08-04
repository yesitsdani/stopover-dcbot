const mongoose = require('mongoose');

const inventoryScema = new mongoose.Schema({
    uid: { type: String, require: true, unique: true },
    items: [{
        id: String,
        quantity: Number
    }],
    equipment: [{
        id: String,
        type: String,
        durability: Number,
    }],
    health: Number,
});

const Inv = mongoose.model("inv", inventoryScema);
module.exports = Inv;
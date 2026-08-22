
const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
    uid: { type: String, require: true, unique: true },
    slots: Number,
    plots: [{
        id: String,
        harvestTime: Number
    }]
});

const Farm = mongoose.model("farm", farmSchema);
module.exports = Farm;

const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
    uid: { type: String, require: true, unique: true },
    plotSlots: Number,
    barnSlots: Number,
    plots: [{
        id: String,
        harvestTime: Number
    }],
    barn: [{
        id: Number,
        harvestTime: Number
    }],
    fertilizer: {
        speedRate: Number,
        untilWhen: Number
    },
    doubleDrop: {
        speedRate: Number,
        untilWhen: Number
    }
});

const Farm = mongoose.model("farm", farmSchema);
module.exports = Farm;
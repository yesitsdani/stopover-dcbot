const mongoose = require('mongoose');

const perksSchema = new mongoose.Schema({
    uid: { type: String, require: true, unique: true },
    cooldownDecrease: {
        untilTime: Number,
        multiplier: Number
    },
    rolePerks: [String],
    dmgBoost: [
        { dmgType: String, untilTime: Number }
    ],
    abundancePoints: Number,
    devotionPoints: Number,
    creationPoints: Number,
    libertyPoints: Number
});

const Perks = mongoose.model("perks", perksSchema);
module.exports = Perks;
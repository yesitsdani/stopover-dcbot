const mongoose = require('mongoose');

const pouchSchema = new mongoose.Schema({
    uid: { type: String, require: true, unique: true },
    level: Number,
    gems: Number,
    authorizedUsers: [String]
});

const Pouch = mongoose.model("pouch", pouchSchema);
module.exports = Pouch;
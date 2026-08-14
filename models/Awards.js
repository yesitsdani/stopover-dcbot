const mongoose = require('mongoose');

const awardsSchema = new mongoose.Schema({
    eventID: { type: String, require: true, unique: true },
    eventName: String,
    nominalToken: String,
    awards: [{
        award: String,
        description: String,
        nominees: [{
            uid: String,
            votes: Number
        }]
    }],
    congeniality: [{
        uid: String,
        votes: Number
    }],
    logs: [{
        uid: String,
        votes: [{
            award: String,
            uid: String
        }]
    }],
    eventFinished: Boolean
});

const Awards = mongoose.model("award", awardsSchema);
module.exports = Awards;
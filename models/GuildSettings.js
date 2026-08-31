const mongoose = require('mongoose');

const guildSettingSchema = new mongoose.Schema({
    gid: { type: String, require: true, unique: true },
    events: [String],
    channels: {
        announcement: String,
        news: String,
        events: String,
        dq: String,
    },
    dqCount: Number,
    newsBuilder: {
        newsType: String,
        articles: [{
            title: String,
            content: String
        }],
        imgURL: String,
        authors: [String]
    },
    announcementBuilder: {
        title: String,
        content: String,
        ping: String,
        imgURL: String,
        signatories: [String]
    },
    afkUsers: [{
        uid: String,
        reason: String,
        afkSince: Number
    }],
    mailedUsers: [String]
});

const GuildSettings = mongoose.model("guildSetting", guildSettingSchema);
module.exports = GuildSettings;
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
    }
});

const GuildSettings = mongoose.model("guildSetting", guildSettingSchema);
module.exports = GuildSettings;
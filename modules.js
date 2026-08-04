const User = require('./models/User');
const { EmbedBuilder } = require(`discord.js`);

module.exports = {
    getIdFromMention(input) {
        if (!input) return null;

        // Already a Discord ID
        if (/^\d{17,20}$/.test(input)) {
            return input;
        }

        // User, role, or channel mention
        const match = input.match(/^<(?:@!?|@&|#)(\d+)>$/);

        return match ? match[1] : null;
    },

    async getUser(uid) {
        return await User.findOneAndUpdate(
            { uid },
            {
                $setOnInsert: {
                    uid,
                    title: "Passerby",
                    marriage: {
                        uid: "",
                        date: 0,
                        ring: "",
                        status: ""
                    },
                    bio: "",
                    money: 100,
                    codesRedeemed: [],
                    cooldowns: []
                }
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );
    },
    createEmbedStandard() {
        return new EmbedBuilder()
            .setColor(0xffa0fb)
            .setFooter({ text: "the stopover bot by ashiii ♡" })
    },
    getMemberName(member) {
        if (member.nickname == null) {
            return member.user.displayName;
        } else {
            return member.nickname;
        }
    }
}
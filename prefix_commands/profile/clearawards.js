const { getUser, getIdFromMention, getMemberName } = require(`../../modules`);
const User = require('../../models/User');

module.exports = {
    name: 'clearaward',
    description: 'Clears a Passerby\'s awards',
    permissions: ['1506448680000159784'],
    category: 'profile',
    usage: '`stp clearaward <member>`',
    testing: false,
    alias: ['clearawards', 'awardclear', 'awardsclear'],
    async execute(client, message, args) {
        if (!args[0]) return await message.reply(`Please tag a member: \`stp clearaward <member>\``);

        const uid = getIdFromMention(args[0]);
        const member = await message.guild.members.fetch(uid).catch(() => null);
        if (uid == null || !member) return await message.reply(`Member not found`);

        const newUser = await User.findOneAndUpdate(
            { uid },
            {
                $set: {
                    awards: []
                },
                $setOnInsert: {
                    uid,
                    title: "",
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
        )

        if (newUser.awards.length < 1) {
            return await message.reply(`Awards of ${getMemberName(member)} cleared`);
        } else {
            return await message.reply('\`ERROR\`: Awards not cleared');
        }
    }
}
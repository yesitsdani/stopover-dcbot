const { getUser, getIdFromMention } = require(`../../modules`);
const User = require('../../models/User');

module.exports = {
    name: 'title',
    description: 'Sets a Passerby\'s title',
    permissions: ['1506448680000159784', '1511897066262237285'],
    category: 'profile',
    usage: '`stp title <member OR title>`',
    testing: false,
    alias: ['bestow'],
    async execute(client, message, args) {
        if (!args[0]) return await message.reply(`Please set a title to bestow upon yourself: \`stp title <title>\`. You can also bestow a title on another person using: \`stp title <user> <title>\``);

        let uid = message.author.id;
        let title = "Passerby";

        if (args[0].startsWith('<@')) {
            uid = getIdFromMention(args[0]);
            if (uid == null) return await message.reply(`Member not found.`);

            args.shift();
            if (!args[0]) return await message.reply(`Please set a title to bestow to the user. \`stp title <member> <title>\``);
            title = args.join(' ');
        } else {
            title = args.join(' ');
        }

        if (title.length > 30) return await message.reply('Titles that are bestowed can only be 30 characters long.');

        const newUser = await await User.findOneAndUpdate(
            { uid },
            {
                $set: {
                    title
                },
                $setOnInsert: {
                    uid,
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
        return await message.reply(`New title set: **${newUser.title}** | Use \`stp passerby [user]\` to view`);
    }
}
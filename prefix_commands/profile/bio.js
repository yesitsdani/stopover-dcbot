const { getUser } = require(`../../modules`);
const User = require('../../models/User');

module.exports = {
    name: 'bio',
    description: 'Sets your Passerby Profile Bio',
    permissions: [],
    category: 'profile',
    usage: '`stp bio <text>`',
    testing: false,
    alias: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        if (!args[0]) {
            const user = await getUser(uid);
            if (!user.bio || user.bio.length < 1) return await message.reply(`You have no bio yet. Set one using: \`stp bio <text>\`. \`<text>\` may only be 255 characters long.`);
            return await message.reply(`Your current bio is: ${user.bio}`);
        } else {
            const newBio = args.join(" ");
            if (newBio.length > 255) return await message.reply(`You bio can only be \`255\` characters long.`);
            const newUser = await await User.findOneAndUpdate(
                { uid },
                {
                    $set: {
                        bio: newBio
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
            return await message.reply(`New bio set: **${newUser.bio}** | Use \`stp passerby\` to view`);
        }
    }
}
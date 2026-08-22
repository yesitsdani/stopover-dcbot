const { getUser, getIdFromMention, getMemberName } = require(`../../modules`);
const User = require('../../models/User');

module.exports = {
    name: 'award',
    description: 'Bestows an award to a passerby',
    permissions: ['1506448680000159784'],
    category: 'profile',
    usage: '`stp award <member OR awards>`',
    testing: false,
    bypassDeath: true,
    alias: [],
    async execute(client, message, args) {
        if (!args[0]) return await message.reply(`Please set an award to bestow upon yourself: \`stp award <title>\`. You can also bestow an award on another person using: \`stp award <user> <award>\``);

        let uid = message.author.id;
        let title = "Passerby";

        if (getIdFromMention(args[0]) != null) {
            uid = getIdFromMention(args[0]);
            if (uid == null) return await message.reply(`Member not found`);

            args.shift();
            if (!args[0]) return await message.reply(`Please set a title to bestow to the user. \`stp title <member> <title>\``);
            title = args.join(' ');
        } else {
            title = args.join(' ');
        }


        const member = await message.guild.members.fetch(uid).catch(() => null);
        if (!member) return await message.reply(`Member not found`);

        let awardsToAdd = title.split(' | ');
        const user = await getUser(uid);

        let userAwards = user.awards;
        for (x of awardsToAdd) {
            userAwards.push(x);
        }

        const newUser = await User.findOneAndUpdate(
            { uid },
            { awards: userAwards },
            { returnDocument: 'after' }
        )

        await message.reply(`Awards added for **${getMemberName(member)}**: \`${awardsToAdd.join(', ')}\``);
    }
}
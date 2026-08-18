const { getIdFromMention, createEmbedStandard, getMemberName } = require("../../modules");
const { devotionPoint } = require("../../calculator");


module.exports = {
    name: 'wagwagan',
    description: 'Wagwags a Passerby!',
    category: 'action',
    usage: '`stp wagwagan <passerby>`',
    cooldown: 1000 * 60 * 1,
    testing: false,
    alias: ['fight', 'wagwag', 'sabunot', 'sabunutan'],
    permissions: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        if (!args[0]) return await message.reply(`Why are you punching air, bes? Please use \`stp hug <passerby>\``);

        if (!args[0].startsWith(`<@`)) return await message.reply(`You have to tag the Passerby`);

        const target = getIdFromMention(args[0]);
        if (target == null) return await message.reply(`Why are you punching air, bes?`);
        if (target == uid) return await message.reply(`Not like that, Passerby. Not like that.`);
        const member = await message.guild.members.fetch(target);
        if (member.user.bot) return message.reply(`In this age of AI? Are you sure about that...`);
        const targetName = getMemberName(member);

        const gifs = [
            "https://i.redd.it/7essyy30pj7x.gif",
            "https://contents.pep.ph/images2/news/7a1a0a856.gif",
            "https://media.tenor.com/W_igImlld00AAAAM/drph-angel-drag-race-angel.gif"
            ];
        const captions = [
            `Hawakan mo nga sa tenga si ${targetName}... walang aawat ah!`,
            `Winagwag mo si ${targetName}!`,
            `BOOGSH!! ${targetName} ahh!!!`,
            `Ginawa mong punching bag si ${targetName}`,
            `Fight kayo bes oh, ${targetName}... FIGHT!!`
        ];

        const gif = gifs[Math.floor(Math.random() * gifs.length)];
        const caption = captions[Math.floor(Math.random() * captions.length)];

        const embed = createEmbedStandard()
        .setAuthor({ name: caption, iconURL: message.author.avatarURL() })
        .setImage(gif)

        await message.reply({ embeds: [embed] });
        await devotionPoint(uid, target, message);
    }
}
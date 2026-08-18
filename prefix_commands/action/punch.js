const { getIdFromMention, createEmbedStandard, getMemberName } = require("../../modules");
const { devotionPoint } = require("../../calculator");


module.exports = {
    name: 'punch',
    description: 'Punches a Passerby!',
    category: 'action',
    usage: '`stp punch <passerby>`',
    cooldown: 1000 * 60 * 1,
    testing: false,
    alias: ['suntok', 'sapak'],
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
            "https://i0.wp.com/drunkenanimeblog.com/wp-content/uploads/2023/05/anime-boxing.gif",
            "https://i.redd.it/etrabmya4zye1.gif",
            "https://i2.kym-cdn.com/photos/images/original/000/989/495/3b8.gif"
            ];
        const captions = [
            `Sinuntok mo si ${targetName}... walang aawat ah!`,
            `You punched ${targetName}!`,
            `BOOGSH! Sapak!! ${targetName} ahh!!!`,
            `Ginawa mong punching bag si ${targetName}`,
            `Sinapak ka, ${targetName}... sapakyu!!`
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
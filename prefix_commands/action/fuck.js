const { devotionPoint } = require("../../calculator");
const { getIdFromMention, createEmbedStandard, getMemberName } = require("../../modules");

module.exports = {
    name: 'fuck',
    description: 'Fucks a Passerby!',
    category: 'action',
    usage: '`stp fuck <passerby>`',
    cooldown: 1000 * 60 * 1,
    testing: false,
    alias: ['kantot', 'totnak', 'lewd'],
    permissions: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        if (!args[0]) return await message.reply(`Hala, sino aanuhin mo, ha? Please use \`stp hug <passerby>\``);

        const target = getIdFromMention(args[0]);
        if (target == null) return await message.reply(`Hala, sino aanuhin mo, ha?`);
        if (target == uid) return await message.reply(`Have you met your hand?`);
        const member = await message.guild.members.fetch(target);
        if (member.user.bot) return message.reply(`Ano ka, si Plankton?`);
        const targetName = getMemberName(member);

        const gifs = [
            "https://64.media.tumblr.com/d17380482731ef5e93de9e7314592b60/9c71d685285405f3-f2/s500x750/47c3954e4758da66b68446ac0b0b9a535a2ff025.gif",
            "https://i.pinimg.com/originals/be/95/39/be953980574bb07a2d8c4d08cd5465bc.gif",
            "https://animesher.com/orig/1/177/1775/17751/animesher.com_takano-hands-beautiful-1775180.gif"
        ];
        const captions = [
            `Get a room, both of you...`,
            `Pinatiwarik mo si ${targetName}!`,
            `aHH DADDI`,
            `Be gentle with ${targetName}`,
            `You fucked ${targetName}...`
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
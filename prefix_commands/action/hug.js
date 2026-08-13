const { devotionPoint } = require("../../calculator");
const { getIdFromMention, createEmbedStandard, getMemberName } = require("../../modules");

module.exports = {
    name: 'hug',
    description: 'Hugs a Passerby!',
    category: 'action',
    usage: '`stp hug <passerby>`',
    cooldown: 1000 * 60 * 1,
    testing: false,
    alias: ['yakap', 'embrace', 'cuddle'],
    permissions: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        if (!args[0]) return await message.reply(`Sino iha-hug mo bes? Please use \`stp hug <passerby>\``);

        const target = getIdFromMention(args[0]);
        if (target == null) return await message.reply(`Sino iha-hug mo bes?`);
        if (target == uid) return await message.reply(`Yay for #SelfLove bes pero 'wag naman ganyan...`);
        const member = await message.guild.members.fetch(target);
        if (member.user.bot) return message.reply(`Baka makuryente ka diyan bes...`);
        const targetName = getMemberName(member);

        const gifs = [
            "https://i.pinimg.com/originals/6d/e7/d8/6de7d824d79a92955e312e3d84d71b82.gif",
            "https://gifdb.com/images/branded/high/anime-teasing-each-other-gay-hug-jq75nau4ansg03e9.gif",
            "https://64.media.tumblr.com/4a724869997ee052144147d754bd3d24/tumblr_o7wth10On21rveihgo1_640.gif",
            "https://64.media.tumblr.com/ab19575a79c428f84487a6dcd3ff5936/eefac5d0b73b46aa-d9/s540x810/ea24563e2f6881bd8a09bce227917b4c9f9320d0.gif",
        ];
        const captions = [
            `Niyakap mo si ${targetName}... awat naman bes`,
            `You hugged ${targetName}! How cute ehe`,
            `Cuddle lang kayo ni ${targetName} ahh!!!`,
            `Cuddles with ${targetName}? Hell yeah!`,
            `You cuddled ${targetName}... cuddle lang ba?`
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
const { devotionPoint } = require("../../calculator");
const { getIdFromMention, createEmbedStandard, getMemberName } = require("../../modules");

module.exports = {
    name: 'kiss',
    description: 'Kisses a Passerby!',
    category: 'action',
    usage: '`stp kiss <passerby>`',
    cooldown: 1000 * 60 * 1,
    testing: false,
    alias: ['mwa', 'laplap', 'momol'],
    permissions: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        if (!args[0]) return await message.reply(`Sino kikiss mo bes? Please use \`stp kiss <passerby>\``);

        if (!args[0].startsWith(`<@`)) return await message.reply(`You have to tag the Passerby`);

        const target = getIdFromMention(args[0]);
        if (target == null) return await message.reply(`Sino kikiss mo bes?`);
        if (target == uid) return await message.reply(`Yay for #SelfLove bes pero 'wag naman ganyan...`);
        const member = await message.guild.members.fetch(target);
        if (member.user.bot) return message.reply(`Baka makuryente ka diyan bes...`);
        const targetName = getMemberName(member);

        const gifs = [
            "https://i.pinimg.com/originals/f1/5c/77/f15c774e5c58a9f210c7f7647da796f1.gif",
            "https://i.redd.it/fwiwnfsgmzhe1.gif",
            "https://i.makeagif.com/media/12-02-2014/j1Z9lt.gif",
            "https://i.pinimg.com/originals/13/00/fd/1300fd55d03ab175d024b2da23051311.gif",
            "https://i.makeagif.com/media/11-09-2024/xHfaqq.gif"
        ];
        const captions = [
            `Nilaplap mo si ${targetName}... awat naman bes`,
            `You kissed ${targetName}! How cute ehe`,
            `Walang aawat sa momol nila ni ${targetName}!!!`,
            `You pecked ${targetName}'s lips yieee peckpeck`,
            `Kiniss mo si ${targetName} with tongue`
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
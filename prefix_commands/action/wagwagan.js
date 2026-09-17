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
        if (!args[0]) return await message.reply(`Why are you punching air, bes? Please use \`stp wagwagan <passerby>\``);

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
            "https://media.tenor.com/W_igImlld00AAAAM/drph-angel-drag-race-angel.gif",
            'https://images-ext-1.discordapp.net/external/mu9bqGd_WQa1h1jbfkTiVMsbVJLyEMh2O-fC8CBw_WE/https/i.makeagif.com/media/2-21-2019/7lwx1o.gif',
            'https://images-ext-1.discordapp.net/external/jl8wfQ2YUUMfG5NGpabmsssVmUJ7hnZrmyaFNvoSrY4/https/media.tenor.com/IooxRGNEdLYAAAAM/maricel-soriano-jodi-sta-maria.gif',
            'https://media.discordapp.net/attachments/1504351387469746227/1543323718594596964/ssstwitter.com_1699366862288-ezgif.com-video-to-gif-converter.gif?ex=6aacd778&is=6aab85f8&hm=7b43350f205d1908afd5f824ab4fc7f2f881a1cb21e3392d736635cf351e2e28&=&width=640&height=360',
            'https://imgur.com/mpXIUZ4.gif',
            'https://imgur.com/tl9IWzk.gif',
            'https://i.imgur.com/y6parjX.gif',
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
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getIdFromMention, resetCommandCD, getUser, checkIfNum, iconizeMoney, createEmbedStandard, getBetLimit } = require("../../modules");

module.exports = {
    name: 'rockpaperscissors',
    description: 'Plays rock paper scissors.',
    permissions: [],
    category: 'economy',
    usage: '`stp rockpaperscissors <passerby> <bet amount>`',
    cooldown: 1000 * 60 * 1,
    testing: false,
    alias: ['batobatopick', 'rps', 'bbp'],
    async execute(client, message, args) {
        const uid = message.author.id;
        if (message.channel.id == '1506182833562193960') {
            await resetCommandCD(uid, "rockpaperscissors");
            return message.reply(`Susugal sa simbahan? 'di ka kaya karmahin niyan beh?`);
        }

        if (!args[1]) {
            await resetCommandCD(uid, "rockpaperscissors");
            return message.reply(`Please use \`stp rockpaperscissors <passerby> <bet amount>\``);
        }
        let target = getIdFromMention(args[0]);
        if (target == null) {
            await resetCommandCD(uid, "rockpaperscissors");
            return message.reply(`Please tag a passerby properly`);
        }

        if (target == uid) {
            await resetCommandCD(uid, "rockpaperscissors");
            return message.reply(`Sana bumili ka na lang ng salamin beh`);
        }

        const member = await message.guild.members.fetch(target);
        if (!member) {
            await resetCommandCD(uid, "rockpaperscissors");
            return message.reply(`Member cannot be found`);
        }

        if (member.user.bot) {
            await resetCommandCD(uid, "rockpaperscissors");
            return message.reply(`You can't play this with a bot`);
        }

        let betAmount = checkIfNum(args[1]);
        if (betAmount == null) {
            await resetCommandCD(uid, "rockpaperscissors");
            return message.reply(`Please use a valid number for the bet amount`);
        }

        const limit = getBetLimit(message.channel.id);
        if (amount > limit) {
            await resetCommandCD(uid, "rockpaperscissors");
            return message.reply(`You can only bet up to ${iconizeMoney(limit)}`);
        }

        const userData = await getUser(uid);
        const targetData = await getUser(target);

        if (userData.money < betAmount) {
            await resetCommandCD(uid, "rockpaperscissors");
            return message.reply(`You don't have that much gems`);
        }

        if (targetData.money < betAmount) {
            await resetCommandCD(uid, "rockpaperscissors");
            return message.reply(`They don't have that much gems`);
        }

        const embed = createEmbedStandard()
            .setThumbnail(member.user.avatarURL())
            .setDescription(`# \`ROCK, PAPER, SCISSORS!\`\n> To <@${target}>\n\nDo you accept this challenge?\n\n-# These buttons will disappear in 10 seconds...`);

        const actions = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`rps.${target}.offer.accept.${uid}.${betAmount}`)
                    .setLabel(`ACCEPT`)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`rps.${target}.offer.reject.${uid}.${betAmount}`)
                    .setLabel(`REJECT`)
                    .setStyle(ButtonStyle.Danger)
            )

        const messageSent = await message.reply({ embeds: [embed], components: [actions] });

        setTimeout(async () => {
            if (messageSent.content.length < 1) {
                await messageSent.edit({ components: [], content: `Timed out` });
            }
        }, 10000);
    }
}
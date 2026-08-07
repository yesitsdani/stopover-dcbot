const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require(`discord.js`);
const { getIdFromMention, getUser, createEmbedStandard, iconizeMoney, iconizeItem, iconizeTitle } = require(`../../modules`);
const ms = require(`ms`);

module.exports = {
    name: 'passerby',
    description: 'Displays a Passerby\'s information',
    permissions: [],
    category: 'profile',
    usage: '`stp passerby [member]`',
    cooldown: 1000 * 60,
    testing: false,
    alias: ['about-me', 'passerby', 'whois','profile'],
    async execute(client, message, args) {
        let uid = '';
        if (!args[0]) {
            uid = message.author.id;
        } else {
            uid = getIdFromMention(args[0]);
        }

        if (uid == null) return await message.reply(`Member not found.`);
        
        const member = await message.guild.members.fetch(uid);
        const user = await getUser(uid);

        const embed = createEmbedStandard();
        let content = `# <@${uid}> <a:stp_pinksparkles:1528714739004473456>\n`;

        content += iconizeTitle(user.title);

        if (!user.bio || user.bio.length < 1) {
            content += `\n\n *No bio yet. Use \`stp bio <text>\`*`
        } else {
            content += `\n\n *${user.bio}*`
        }

        content += `\n### <a:stp_cutepinkstar:1528713421183520909> Server Marriage`;
        if (user.marriage.uid.length > 0) {
            content += `\n> ❤︎ ${iconizeItem(user.marriage.ring)} \`${user.marriage.status.toUpperCase()}\`: <@${user.marriage.uid}> <a:stp_heartspin:1523664759432548352>`;
            content += `\n> ❤︎ Since: ${ms(Date.now() - parseInt(user.marriage.date), { long: true })} ago`;
        } else {
            content += `\n> ❤︎ \`NOT SERVER MARRIED\``;
            content += `\n> ❤︎ *Maybe soon?*`
        }

        content += `\n### <a:stp_cutegreenstar:1528713624061874318> Awards`;
        if (!user.awards || user.awards.length < 1) {
            content += `\n> ❤︎ No Awards Yet`
        } else {
            for (award of user.awards) {
                content += `\n> ❤︎ \`${award.toUpperCase()}\``;
            }
        }

        content += `\n\n${iconizeMoney(user.money)}`

        embed
        .setThumbnail(member.user.avatarURL())
        .setDescription(content);

        const menu = new StringSelectMenuBuilder()
        .setCustomId(`profile.${uid}`)
        .setPlaceholder(`Select Passerby Profile`)
        .setMaxValues(1)
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setValue(`main`)
            .setDescription(`Profile in The Stopover`)
            .setLabel(`Passerby Profile`),
            new StringSelectMenuOptionBuilder()
            .setValue(`rpg`)
            .setDescription(`Passerby Battle Stats`)
            .setLabel(`RPG Profile`),
            new StringSelectMenuOptionBuilder()
            .setValue(`close`)
            .setDescription(`Removes the selection menu from this message`)
            .setLabel(`Close Menu`)
        )

        const actions = new ActionRowBuilder()
        .addComponents(menu)

        await message.reply({ embeds: [embed], components: [actions] });
    }
}
const {} = require(`discord.js`);
const { getIdFromMention, getUser, createEmbedStandard, iconizeMoney, iconizeItem } = require(`../../modules`);
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

        if (user.title.toLowerCase() == "the chief passerby") {
            content += `<:gavel:1534097246675796009>`
        } else if (user.title.toLowerCase() == "member of the stopover council") {
            content += `<:council:1534102603040821308>`
        } else if (user.title.toLowerCase() == "first lady") {
            content += `<:stp_pinkbow:1534224205992955956>`
        } else {
            content += `<a:stp_pinkdiaheart:1532004326652772494>`
        }
        content += ` **\`${user.title.toUpperCase()}\`**`

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

        await message.reply({ embeds: [embed] });
    }
}
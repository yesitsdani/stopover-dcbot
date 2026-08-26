const { createPlayerStat } = require("../../calculator");
const { createEmbedStandard, getIdFromMention, getRpgUser, iconizeRpgClass, createLoadingScreen } = require("../../modules");

module.exports = {
    name: 'stats',
    description: 'Displays a Passerby\'s RPG stats',
    permissions: [],
    category: 'rpg',
    usage: '`stp stats [member]`',
    cooldown: 1000 * 60,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        let uid = '';
        if (!args[0]) {
            uid = message.author.id;
        } else {
            uid = getIdFromMention(args[0]);
        }

        if (uid == null) return await message.reply(`Member not found.`);

        const member = await message.guild.members.fetch(uid);

        const embed = createEmbedStandard()
            .setThumbnail(member.user.avatarURL());
        let content = `# <@${uid}> <a:stp_pinksparkles:1528714739004473456>\n`;

        const rpgData = await getRpgUser(uid);
        if (rpgData.class.length > 0) { content += `${iconizeRpgClass(rpgData.class)}` }
        else { content += `:question: \`No Class Yet\` (Use \`stp class\`)` }

        const stat = createPlayerStat(rpgData);

        content += `\n:dagger: ATK: ${stat.atk} | :shield: DEF: ${stat.def}`;
        content += `\n### :dagger: DMG BONUSES:`;
        content += `\nMelee DMG Bonus: ${parseInt(stat.meleeDmg * 100)}%`;
        content += `\nMagic DMG Bonus: ${parseInt(stat.magicDmg * 100)}%`;
        content += `\nRange DMG Bonus: ${parseInt(stat.rangeDmg * 100)}%`;
        content += `\n### :shield: DMG RESISTANCE:`;
        content += `\nMelee Resistance: ${parseInt(stat.meleeRes * 100)}%`;
        content += `\nMagic Resistance: ${parseInt(stat.magicRes * 100)}%`;
        content += `\nRange Resistance: ${parseInt(stat.rangeRes * 100)}%`;

        content += `\n\n-# Based on: Passerby Class, Level, Equipment`;

        embed.setDescription(content);

        const messageSent = await message.reply({ embeds: [createLoadingScreen()] });

        setTimeout(async () => {
            messageSent.edit({ embeds: [embed] });
        }, 2000)
    }
}
const { ActionRowBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require("discord.js");
const { nextLevel } = require("../../calculator");
const { getIdFromMention, getRpgUser, iconizeRpgClass, iconizeItemWithName, createEmbedStandard } = require("../../modules");

module.exports = {
    name: 'rpgprofile',
    description: 'Displays a Passerby\'s RPG information',
    permissions: [],
    category: 'rpg',
    usage: '`stp rpgprofile [member]`',
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

        const rpgUser = await getRpgUser(uid);
        if (rpgUser.class.length > 0) { content += `${iconizeRpgClass(rpgUser.class)}` }
        else { content += `:question: \`No Class Yet\` (Use \`stp class\`)` }
        
        content += `\n### <a:stp_cutepinkstar:1528713421183520909> Battle Stats`;
        content += `\n:nazar_amulet: Level: ${rpgUser.level}  |  XP: \`${rpgUser.xp}\` / \`${nextLevel(rpgUser.level)}\``;
        content += `\n:heartpulse: Health: \`${rpgUser.health}\` / \`${rpgUser.maxHealth}\``;
        content += `\n### <a:stp_cutegreenstar:1528713624061874318> Equipment\nWeapon: `;

        if (rpgUser.weap.id.length < 1) {
            content += `\`NO WEAPON YET\``;
        } else {
            content += `${iconizeItemWithName(rpgUser.weap.id)}`;
        }

        content += `\nArmor: `

        if (rpgUser.armor.id.length < 1) {
            content += `\`NO ARMOR YET\``;
        } else {
            content += `${iconizeItemWithName(rpgUser.armor.id)}`;
        }

        embed
            .setDescription(content)

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

        const messageSent = await message.reply({ embeds: [embed], components: [actions] });

        setTimeout(async () => {
            await messageSent.edit({ components: [] });
        }, 10000);

    }
}
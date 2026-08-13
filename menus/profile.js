const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { nextLevel } = require("../calculator");
const { iconizeItemWithName, getUser, createEmbedStandard, getRpgUser, iconizeRpgClass, iconizeTitle, iconizeItem, iconizeMoney } = require("../modules");
const ms = require("ms");

module.exports = {
    name: "profile",
    async execute(client, interaction, args) {
        const uid = args.shift();
        const chosen = interaction.values[0];
        await interaction.deferUpdate();

        const member = await interaction.guild.members.fetch(uid);

        const embed = createEmbedStandard()
            .setThumbnail(member.user.avatarURL());
        let content = `# <@${uid}> <a:stp_pinksparkles:1528714739004473456>\n`;

        if (chosen == "main") {
            const user = await getUser(uid);
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
        } else if (chosen == "rpg") {
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

        } else if (chosen == "close") {
            return await interaction.editReply({ components: [] });
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

        return await interaction.editReply({ embeds: [embed], components: [actions] });
    }
}
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { createEmbedStandard, getRpgUser, iconizeMoney, createLoadingScreen } = require("../../modules");

module.exports = {
    name: 'classreset',
    description: 'Chooses your class',
    permissions: [],
    category: 'rpg',
    usage: '`stp class`',
    cooldown: 1000 * 60,
    testing: false,
    alias: ['resetclass'],
    async execute(client, message, args) {
        const uid = message.author.id;
        const rpgData = await getRpgUser(uid);
        if (rpgData.class.length < 1) return message.reply(`You don't belong to a class. Use \`stp class\``);

        const embed = createEmbedStandard()
            .setDescription(`# \`RESET YOUR CLASS?\`\n> Are you sure you want to do this?\n\nResetting your class would:\n1. Unequip your armor and weapon (would also remove their enchantments)\n2. Reset your level back to 1.\n3. Fine you ${iconizeMoney(5000)}\n\n-# Buttons will time out in 10 seconds`)
            .setThumbnail(message.author.avatarURL());

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`resetclass.${uid}.confirm`)
                    .setLabel(`Confirm`)
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`resetclass.${uid}.cancel`)
                    .setLabel(`Cancel`)
                    .setStyle(ButtonStyle.Secondary)
            )

        const messageSent = await message.reply({ embeds: [createLoadingScreen()] });

        setTimeout(async () => {
            await messageSent.edit({ embeds: [embed], components: [buttonRow] });
            setTimeout(async () => {
                if (messageSent.content.length < 1) await messageSent.edit({ content: `Timed out`, components: [] });
            }, 10 * 1000);
        }, 2000)
    }
}
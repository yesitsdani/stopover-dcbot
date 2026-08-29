const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { createEmbedStandard } = require("../modules");

module.exports = {
    name: "reactivate",
    async execute(client, interaction, args) {
        const uid = interaction.user.id;
        const member = await interaction.guild.members.fetch(uid);

        const action = args.shift();

        let content = ``;
        const embed = createEmbedStandard().setThumbnail(interaction.user.avatarURL());

        if (action == "primer") {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            content += `# \`YOU ARE ABOUT TO REACTIVATE\`\n> Please read this first:\n### By reactivating, you hereby acknowledge that getting deemed inactive again would require a reinterview to reactivate once more in the future`;

            const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`reactivate.confirm`)
                .setLabel(`Confirm`)
                .setStyle(ButtonStyle.Success)
            )

            embed.setDescription(content);

            return await interaction.editReply({ embeds: [embed], components: [buttonRow] });
        } else if (action == "confirm") {
            await interaction.deferUpdate();

            content += `# \`REACTIVATED!\`\n> Welcome back, Passerby!\n\nYour inactive role will be removed in a few seconds, please wait.`;
            embed.setDescription(content);
            
            const modLogs = await interaction.guild.channels.fetch(`1518574560033636412`);
            const logEmbed = createEmbedStandard()
            .setDescription(`\`INACTIVE LOG:\` <@${uid}> reactivated. If they are deemed inactive once again, they must be interviewed to reactivate`);

            await modLogs.send({ embeds: [logEmbed] });

            await interaction.editReply({ embeds: [embed], components: [] });
            setTimeout(async () => {
                await member.roles.remove(`1507597348363309168`);
            }, 2500);
            return;
        }
    }
}
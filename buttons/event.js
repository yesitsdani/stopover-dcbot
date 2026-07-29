const { MessageFlags } = require("discord.js")

module.exports = {
    name: "event",
    async execute(client, interaction, args) {
        console.log({
            id: interaction.id,
            token: interaction.token,
            applicationId: interaction.applicationId,
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            customId: interaction.customId,
        });
        console.log("Age:", Date.now() - interaction.createdTimestamp);

        await interaction.reply({ content: `Hello`, flags: MessageFlags.Ephemeral });

        console.log("Deferred!");
    }
}
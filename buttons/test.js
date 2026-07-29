const { MessageFlags } = require("discord.js")

module.exports = {
    name: "test",
    async execute(client, interaction, args) {
        if (args[0] == "one") return await interaction.reply({ content: `One`, flags: MessageFlags.Ephemeral});
        if (args[0] == "two") return await interaction.reply({ content: `Two`, flags: MessageFlags.Ephemeral});
    }
}
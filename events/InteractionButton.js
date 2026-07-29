const { MessageFlags } = require(`discord.js`);

module.exports = {
    async run(client, interaction) {
        const args = interaction.customId.split(".");
        const btn = args.shift();

        const button = client.buttons.get(btn);
        if (!button) return await interaction.reply({ content: `Error!`, flags: MessageFlags.Ephemeral });

        try {
            await button.execute(client, interaction, args);
        } catch (e) {
            console.error("Original error:");
            console.error(e);

            if (!interaction.replied && !interaction.deferred) {
                try {
                    await interaction.reply({
                        content: "Error!",
                        flags: MessageFlags.Ephemeral,
                    });
                } catch (_) { }
            }
        }
    }
}
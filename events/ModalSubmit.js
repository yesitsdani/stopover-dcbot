const { MessageFlags } = require(`discord.js`);

module.exports = {
    async run(client, interaction) {
        const args = interaction.customId.split(".");
        const mdl = args.shift();

        const modal = client.modals.get(mdl);
        if (!modal) return await interaction.reply({ content: `Error!`, flags: MessageFlags.Ephemeral });

        try {
            await modal.execute(client, interaction, args);
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
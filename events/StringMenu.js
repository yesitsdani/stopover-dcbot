module.exports = {
    async run(client, interaction) {
        const args = interaction.customId.split(".");
        const smn = args.shift();

        const menu = client.menus.get(smn);
        if (!menu) return await interaction.reply({ content: `Error!`, flags: MessageFlags.Ephemeral });

        try {
            await menu.execute(client, interaction, args);
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
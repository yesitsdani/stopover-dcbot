
module.exports = {
    name: "removebtn",
    async execute(client, interaction, args) {
        return await interaction.update({ components: [] });
    }
}
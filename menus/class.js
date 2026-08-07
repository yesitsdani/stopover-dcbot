const { MessageFlags } = require("discord.js");
const Rpg = require("../models/Rpg");
const { iconizeRpgClass, printValidWeapon, createEmbedStandard } = require("../modules");

module.exports = {
    name: "class",
    async execute(client, interaction, args) {
        const uid = args.shift();
        if (interaction.user.id != uid) return interaction.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });

        const chosen = interaction.values[0];
        await interaction.deferUpdate();

        await Rpg.findOneAndUpdate(
            { uid },
            { class: chosen }
        );

        let content = `# ${iconizeRpgClass(chosen)}\n> You can now equip **${printValidWeapon(chosen)}**!`;

        const embed = createEmbedStandard()
        .setDescription(content)
        .setThumbnail(interaction.user.avatarURL())

        return await interaction.editReply({ embeds: [embed], components: [] })
    }
}
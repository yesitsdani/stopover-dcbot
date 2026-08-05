const { ContainerBuilder, TextDisplayBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { iconizeItemWithName } = require("../modules");

module.exports = {
    name: "marry",
    async execute(client, interaction, args) {
        const action = args.shift();
        const chosen = interaction.values[0];
        if (action == 'choosering') {
            const uid = args.shift();
            if (interaction.user.id != uid) return await interaction.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });
            const target = args.shift();
            const container = new ContainerBuilder().setAccentColor(0xffa0fb)

            if (chosen != 'cancel') {
                container
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`-# <@${target}>\n# \`SOMEONE IS PROPOSING TO YOU\`\n> Will you accept <@${uid}>'s server-marriage proposal?`)
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`marry.respond.yes.${target}.${uid}.${chosen}`)
                                    .setLabel(`Yes`)
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId(`marry.respond.no.${target}.${uid}.${chosen}`)
                                    .setLabel(`No`)
                                    .setStyle(ButtonStyle.Danger)
                            )
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`${iconizeItemWithName(chosen)}\n\n-# the stopover bot by ashiii ♡`)
                    )
            } else {
                container
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`-# <@${uid}>\n# \`PROPOSAL CANCELLED\`\n> Maybe next time?\n\n-# the stopover bot by ashiii ♡`)
                    )
            }

            return await interaction.update({ components: [container], flags: MessageFlags.IsComponentsV2 });
        }
    }
}
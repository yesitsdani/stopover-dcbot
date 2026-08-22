const { ActionRowBuilder, UserSelectMenuBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuOptionBuilder } = require("discord.js");
const { getMemberName, createEmbedStandard } = require("../modules");

module.exports = {
    name: "manage",
    async execute(client, interaction, args) {
        const uid = args.shift();
        if (uid != interaction.user.id) return interaction.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });
        const targetUid = args.shift();
        const action = args.shift();

        if (action == "other") {
            const actions = new ActionRowBuilder()
                .addComponents(
                    new UserSelectMenuBuilder()
                        .setCustomId(`manage.${uid}`)
                        .setPlaceholder(`Select a Passerby`)
                        .setMaxValues(1)
                        .setMinValues(1)
                )

            return await interaction.update({ components: [actions] });
        }

        if (action == "batch") {
            const actions = new ActionRowBuilder()
                .addComponents(
                    /* new ButtonBuilder()
                    .setCustomId(`manage.${uid}.${targetUid}.batchSet.one`)
                    .setLabel(`1NDERFUL`) 
                    .setStyle(ButtonStyle.Secondary)*/
                    new StringSelectMenuBuilder()
                        .setCustomId(`manage.${uid}.${targetUid}.batchSet`)
                        .setPlaceholder(`Select Batch Role to Set`)
                        .setMaxValues(1)
                        .addOptions(
                            new StringSelectMenuOptionBuilder()
                                .setValue(`1513016636280541234`)
                                .setLabel(`Batch 1NDERFUL`),
                            new StringSelectMenuOptionBuilder()
                                .setValue(`1513016746326495286`)
                                .setLabel(`Batch 2ND2NONE`),
                            new StringSelectMenuOptionBuilder()
                                .setValue(`1515313966845267988`)
                                .setLabel(`Batch 3UPHORIA`),
                            new StringSelectMenuOptionBuilder()
                                .setValue(`1521884104738607104`)
                                .setLabel(`Batch 4TUNE`),
                            new StringSelectMenuOptionBuilder()
                                .setValue(`1523321069438636203`)
                                .setLabel(`Batch 5TAR`),
                            new StringSelectMenuOptionBuilder()
                                .setValue(`1538537845302632548`)
                                .setLabel(`Batch 6ORGEOUS`)
                        )
                )

            return await interaction.update({ components: [actions] });
        }

        await interaction.deferUpdate();

        const member = await interaction.guild.members.fetch(targetUid);
        const origMember = await interaction.guild.members.fetch(uid);

        let content = `### <@${targetUid}>'s `;

        if (action == "selfie") {
            if (member.roles.cache.has("1518254127006744696")) {
                await member.roles.remove("1518254127006744696");
                content += ` selfie access has been removed by ${getMemberName(origMember)} (<@${uid}>)`;
            } else {
                await member.roles.add("1518254127006744696");
                content += ` selfie access has been granted by ${getMemberName(origMember)} (<@${uid}>)`;
            }
        } else if (action == "nsfw") {
            if (member.roles.cache.has("1504338673900982272")) {
                await member.roles.remove(["1504338673900982272","1504331922246209717"]);
                content += ` NSFW access has been removed by ${getMemberName(origMember)} (<@${uid}>)`;
            } else {
                await member.roles.add("1504338673900982272");
                content += ` NSFW access has been granted by ${getMemberName(origMember)} (<@${uid}>)`;
            }
        }

        const embed = createEmbedStandard()
            .setThumbnail(member.user.avatarURL())
            .setDescription(content)

        const modLogs = await interaction.guild.channels.fetch('1518574560033636412');
        await modLogs.send(content);

        await interaction.editReply({ embeds: [embed], components: [] })
    }
}
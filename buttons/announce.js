const { MessageFlags, ModalBuilder, LabelBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { createAnnouncementModal, updateAnnouncementBuilder, createAnnouncementCaption, createAnnouncementButtons, createAnnouncementEmbed } = require("../prefix_commands/council/announce");
const { getGuildSettings } = require("../modules");

module.exports = {
    name: "announce",
    async execute(client, interaction, args) {
        const uid = interaction.user.id;
        const member = await interaction.guild.members.fetch(uid);

        const allowedRoles = ['1506448680000159784', '1511897066262237285'];
        const hasPermission = allowedRoles.some((perm) => member.roles.cache.has(perm));
        if (!hasPermission) return await interaction.reply({ content: "You must be a <:council:1534102603040821308> **`MEMBER OF THE STOPOVER COUNCIL`** to do this", flags: MessageFlags.Ephemeral });

        const gid = interaction.guild.id;
        const guildData = await getGuildSettings(gid);
        let announcementBuilder = guildData.announcementBuilder;

        const action = args.shift();

        if (action == "write") {
            const modal = createAnnouncementModal(announcementBuilder);
            return await interaction.showModal(modal);

        } else if (action == "setPing") {
            const option = args.shift();
            await interaction.deferUpdate();

            if (option == "primer") {
                const buttonRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`announce.setPing.announce`)
                            .setLabel(`Announcement Ping`)
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`announce.setPing.all`)
                            .setLabel(`All Passersby`)
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId(`announce.setPing.none`)
                            .setLabel(`None (FYI Post)`)
                            .setStyle(ButtonStyle.Secondary)
                    )

                return await interaction.editReply({ components: [buttonRow] });
            } else {
                let ping = "";
                if (option == "announce") ping = "<@&1506156891917647952>";
                if (option == "all") ping = "**ATTENTION**, all <@&1504331357386440704>";

                announcementBuilder[`ping`] = ping;
                const newGuildData = await updateAnnouncementBuilder(gid, announcementBuilder);

                return await interaction.editReply({
                    content: createAnnouncementCaption(newGuildData.announcementBuilder),
                    components: [createAnnouncementButtons(newGuildData.announcementBuilder)]
                });
            }
        } else if (action == "forSign") {
            const option = args.shift();
            await interaction.deferUpdate();

            if (option == "primer") {
                const buttonRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`announce.forSign.sign`)
                            .setLabel(`Sign This`)
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId(`announce.forSign.retract`)
                            .setLabel(`Retract Signature`)
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId(`announce.forSign.edit`)
                            .setLabel(`Edit Again`)
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId(`announce.forSign.publish`)
                            .setLabel(`Post Announcement`)
                            .setStyle(ButtonStyle.Success)
                    )

                return await interaction.editReply({ components: [buttonRow] });
            } else if (option == "publish") {
                const announceChannelId = guildData.channels.announcement;
                const channel = await interaction.guild.channels.fetch(announceChannelId);

                await channel.send({
                    embeds: [createAnnouncementEmbed(announcementBuilder)],
                    content: createAnnouncementCaption(announcementBuilder)
                });

                announcementBuilder = {
                    title: "",
                    content: "",
                    ping: "",
                    imgURL: "",
                    signatories: []
                }

                await updateAnnouncementBuilder(gid, announcementBuilder);
                return await interaction.editReply({ embeds: [], components: [], content: `Announcement sent to <#${announceChannelId}>` });
            } else if (option == "edit") {
                announcementBuilder[`signatories`] = [];
                const newGuildData = await updateAnnouncementBuilder(gid, announcementBuilder);

                return await interaction.editReply({
                    embeds: [createAnnouncementEmbed(newGuildData.announcementBuilder)],
                    components: [createAnnouncementButtons(newGuildData.announcementBuilder)]
                });
            } else {
                let signatories = announcementBuilder.signatories;

                if (option == "sign" && !signatories.includes(uid)) signatories.push(uid);
                if (option == "retract") signatories = signatories.filter(itm => itm != uid);

                announcementBuilder[`signatories`] = signatories;
                const newGuildData = await updateAnnouncementBuilder(gid, announcementBuilder);

                return await interaction.editReply({
                    embeds: [createAnnouncementEmbed(newGuildData.announcementBuilder)]
                });
            }
        }
    }
}
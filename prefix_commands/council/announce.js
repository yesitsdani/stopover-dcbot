const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, LabelBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { createEmbedStandard, getGuildSettings } = require("../../modules")
const signatures = require('../../data/signatures.json');
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
    name: 'announce',
    description: 'Announces in the announcement chat [Authorized Only]',
    category: 'council',
    usage: '`stp announce`',
    cooldown: 1000 * 5,
    testing: false,
    bypassDeath: true,
    alias: ['anunsyo'],
    permissions: ['1506448680000159784', '1511897066262237285'],
    async execute(client, message, args) {
        const gid = message.guild.id;

        if (args[0] && args[0].toLowerCase() == "clear") {
            const announcementBuilder = {
                title: "",
                content: "",
                ping: "",
                imgURL: "",
                signatories: []
            }

            await this.updateAnnouncementBuilder(gid, announcementBuilder);
            return message.reply(`Announcement builder cleared!`);
        }

        const guildData = await getGuildSettings(gid);
        let announcementBuilder = guildData.announcementBuilder;

        const embed = module.exports.createAnnouncementEmbed(announcementBuilder);
        const actions = module.exports.createAnnouncementButtons(announcementBuilder);
        const caption = module.exports.createAnnouncementCaption(announcementBuilder)

        return message.reply({ content: caption, embeds: [embed], components: [actions] });
    },

    createAnnouncementEmbed(announcementBuilder) {
        const embed = createEmbedStandard().setThumbnail(`https://imgur.com/8W7T78Y.png`);

        let content = ``;
        if (announcementBuilder.title.length > 0) {
            content += `# \`${announcementBuilder.title.toUpperCase()}\`\n`
        } else {
            content += `# \`NO TITLE YET\`\n`;
        }

        if (announcementBuilder.content.length > 0) {
            content += `\n${announcementBuilder.content}\n`
        } else {
            content += `\n\`NO ANNOUNCEMENT YET\`\n`;
        }

        if (announcementBuilder.imgURL.length > 0) embed.setThumbnail(announcementBuilder.imgURL);

        if (announcementBuilder.signatories.length > 0) {
            let councilSigns = 0;
            let councilSignatoryBuilder = ``;
            let chiefSignatoryBuilder = ``;

            for (signatory of announcementBuilder.signatories) {
                const signature = signatures.find(sgn => sgn.uid == signatory);
                if (!signature) continue;
                if (signature.signType == "chief") {
                    chiefSignatoryBuilder += `# ${signature.signature} <a:stp_pinksparkles:1543172551079886949>\n-# <:gavel:1534097246675796009> \`THE CHIEF PASSERBY\``
                } else if (signature.signType == "council") {
                    councilSigns++;
                    councilSignatoryBuilder += `# ${signature.signature} <a:stp_bluesparkle:1543172552707276820>\n`;
                }
            }

            content += `\nSigned,\n`

            if (councilSigns > 0) {
                councilSignatoryBuilder += `-# <:council:1534102603040821308> \`MEMBER`;
                if (councilSigns > 1) councilSignatoryBuilder += `S`
                councilSignatoryBuilder += ` OF THE STOPOVER COUNCIL\`\n`;

                content += councilSignatoryBuilder;
            }

            content += chiefSignatoryBuilder;
        }

        embed.setDescription(content);

        return embed;
    },

    createAnnouncementButtons(announcementBuilder) {
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`announce.write`)
                    .setLabel(`Write / Edit`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`announce.setPing.primer`)
                    .setLabel(`Set Ping`)
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`removebtn`)
                    .setLabel(`Remove Buttons`)
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`announce.forSign.primer`)
                    .setLabel(`Save and Sign`)
                    .setStyle(ButtonStyle.Success)
            )

        return buttonRow;
    },

    createAnnouncementModal(announcementBuilder) {
        const modal = new ModalBuilder()
            .setCustomId(`announce.write`)
            .setTitle(`Announcement`)
            .addLabelComponents(
                new LabelBuilder()
                    .setLabel(`Title`)
                    .setTextInputComponent(
                        new TextInputBuilder()
                            .setCustomId(`title`)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder(`Add Announcement Title`)
                            .setRequired(true)
                            .setValue(announcementBuilder.title ?? "")
                    )
            )
            .addLabelComponents(
                new LabelBuilder()
                    .setLabel(`Announcement`)
                    .setTextInputComponent(
                        new TextInputBuilder()
                            .setCustomId(`announcement`)
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder(`Add Announcement Message`)
                            .setRequired(true)
                            .setValue(announcementBuilder.content ?? "")
                    )
            )

        return modal;
    },

    createAnnouncementCaption(announcementBuilder) {
        let caption = announcementBuilder.ping;
        return caption;
    },

    async updateAnnouncementBuilder(gid, changes) {
        return await GuildSettings.findOneAndUpdate(
            { gid },
            { announcementBuilder: changes },
            { returnDocument: 'after' }
        );
    }
}
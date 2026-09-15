const { ModalBuilder, LabelBuilder, CheckboxBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getMatchData, updateMatch } = require("../models/Match");
const { getGuildSettings, createEmbedStandard } = require("../modules");
const { logMailEmbed, sortMails, matchHomeGui, likingTimeGui } = require("./mail");
const ms = require("ms");
const { newMatchMail } = require("../alerts");
const { revealEmbed } = require("../prefix_commands/event/matchroom");

module.exports = {
    name: "match",
    async execute(client, interaction, args) {

        const uid = interaction.user.id;
        const gid = interaction.guild.id;
        const action = args.shift();

        const matchData = await getMatchData(uid);
        let mailBuilder = matchData.mailBuilder;

        if (action == "home") {

            await interaction.deferUpdate();
            const guildData = await getGuildSettings(gid);
            const msettings = guildData.MatchMakerSettings;

            if (!guildData.events.includes['matchmaker'] && !(uid == "877167420572319804" || uid == "811596799663800341"))
                return await interaction.editReply(`<:gavel:1534097246675796009> \`THE CHIEF PASSERBY\` has yet to open <a:hearts:1543304375894679552> \`THE STOPOVER: MATCHMAKER\` event. Please come back when the event is active, Passerby!`);

            return await interaction.editReply(matchHomeGui(uid, msettings, matchData));

        } else if (action == "write") {
            const modal = module.exports.matchmailBuilderModal(matchData.mailBuilder);
            return await interaction.showModal(modal);
        } else if (action == "send") {
            const option = args.shift();

            if (option == "primer") {
                await interaction.deferUpdate();

                const buttonRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`match.send.confirm`)
                            .setLabel(`Confirm Send`)
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`match.send.cancel`)
                            .setLabel(`Go Back`)
                            .setStyle(ButtonStyle.Secondary)
                    )

                return await interaction.editReply({ content: ``, components: [buttonRow] });

            } else if (option == "cancel") {

                await interaction.deferUpdate();
                return await interaction.editReply(module.exports.matchmailBuilderGui(matchData.mailBuilder));

            } else if (option == "confirm") {
                await interaction.deferUpdate();

                const currentPair = await module.exports.getCurrentPair(gid, matchData);
                const target = currentPair.uid;

                const targetAshimail = await getMatchData(target);
                let receivedMail = targetAshimail.receivedMail;

                const timeNow = Date.now();
                let toTarget = mailBuilder;
                let toAuthor = mailBuilder;

                toTarget[`dateSent`] = timeNow;
                toTarget[`unread`] = true;
                receivedMail.push(toTarget);
                await updateMatch(target, { receivedMail });
                await newMatchMail(interaction.guild.id, target);

                toAuthor[`dateSent`] = timeNow;
                toAuthor[`uid`] = target;
                let sentMail = matchData.sentMail;
                sentMail.push(toAuthor);
                let logMail = toAuthor;

                const mailToLog = logMailEmbed(logMail, uid);
                const logChannel = await interaction.guild.channels.fetch('1543823184472707113');
                await logChannel.send({ embeds: [mailToLog] });

                mailBuilder = {
                    uid: "",
                    anon: false,
                    title: "",
                    content: "",
                    unread: false,
                    dateSent: 0,
                    signed: false
                }
                await updateMatch(uid, { sentMail, mailBuilder });

                let content = `# \`MATCHMAIL SENT!\`\n> To: Your Anonymous Pairing\n\nYou have sent them a Matchmail! Press the button below to go back to dashboard!`

                const embed = createEmbedStandard()
                    .setDescription(content)

                const buttonRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`match.home`)
                            .setLabel(`Back to Dashboard`)
                            .setStyle(ButtonStyle.Primary)
                    )

                return await interaction.editReply({ embeds: [embed], components: [buttonRow] });

            }
        } else if (action == "inbox") {
            await interaction.deferUpdate();
            const gui = module.exports.matchInboxGui(matchData, 1, 'received');
            return await interaction.editReply(gui);
        } else if (action == "judge") {
            await interaction.deferUpdate();
            const option = args.shift();
            const msettings = await module.exports.getMatchSettings(gid);

            if (option == 'primer') {

                return await interaction.editReply(await likingTimeGui(uid, msettings));

            } else if (option == 'no') {
                let currentPair = await module.exports.getCurrentPair(gid, matchData);
                let pairs = matchData.pairs;
                
                currentPair[`finished`] = true;
                pairs[msettings.matchIndex] = currentPair;

                const logChannel = await interaction.guild.channels.fetch('1543823184472707113');
                await logChannel.send(`💌 \`MATCHMAKER EVENT\`: <@${uid}> did not like their Pair :(( (Pair #${msettings.matchIndex + 1})`);

                await updateMatch(uid, { pairs });

                const embed = createEmbedStandard()
                    .setDescription(`# \`YOU HAVE CHOSEN TO NOT MEET YOUR PAIR\`\n> Thank you, Passerby!`);

                return await interaction.editReply({ embeds: [embed], components: [] });
            } else if (option == 'yes') {
                let currentPair = await module.exports.getCurrentPair(gid, matchData);
                let pairs = matchData.pairs;

                currentPair[`liked`] = true;
                currentPair[`finished`] = true;
                pairs[msettings.matchIndex] = currentPair;

                const logChannel = await interaction.guild.channels.fetch('1543823184472707113');
                await logChannel.send(`💌 \`MATCHMAKER EVENT\`: <@${uid}> liked their Pair! (Pair #${msettings.matchIndex + 1})`);

                await updateMatch(uid, { pairs });

                const embed = createEmbedStandard()
                    .setDescription(`# 💌 \`YOU LIKED YOUR MATCH #${msettings.matchIndex + 1}!\`\n> If they liked you as well, you will get to know each others' identity after 💌 \`THE STOPOVER MATCHMAKER\` event\n\nThank you, Passerby!`);

                return await interaction.editReply({ embeds: [embed], components: [] });
            }
        } else if (action == "reveal") {
            await interaction.deferUpdate();
            const embed = await revealEmbed(uid);
            return await interaction.editReply({ embeds: [embed], components: [] });
        }
    },

    matchmailBuilderModal(mailBuilder) {
        const modal = new ModalBuilder()
            .setCustomId(`match.write`)
            .setTitle(`Write Matchmail`)
            .addLabelComponents(
                new LabelBuilder()
                    .setLabel(`Content`)
                    .setTextInputComponent(
                        new TextInputBuilder()
                            .setCustomId(`content`)
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder(`Add Matchmail Message`)
                            .setRequired(true)
                            .setValue(mailBuilder.content ?? "")
                    )
            )

        return modal;
    },

    receivedMatchmailEmbed(mail) {
        let content = `# \`RE\`: <a:stp_pinkdiaheart:1532004326652772494> ${mail.title}\n> From: \`💌\`\n`;

        if (mail.dateSent != 0) content += `> ${ms(Date.now() - parseInt(mail.dateSent), { long: true })} ago\n`;

        content += `\n${mail.content}\n\n💌 \`THE STOPOVER MATCHMAKER EVENT\` <a:stp_heartspin:1523664759432548352>`;

        const embed = createEmbedStandard()
            .setDescription(content);
        return embed;
    },

    matchmailBuilderGui(mailBuilder) {
        const embed = module.exports.receivedMatchmailEmbed(mailBuilder);
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`match.write`)
                    .setLabel(`Edit Draft`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`match.home`)
                    .setLabel(`Back to Dashboard`)
                    .setStyle(ButtonStyle.Secondary)
            )

        buttonRow.addComponents(
            new ButtonBuilder()
                .setCustomId(`match.send.primer`)
                .setLabel(`Send Matchmail`)
                .setStyle(ButtonStyle.Success)
        )

        return { content: ``, embeds: [embed], components: [buttonRow] };
    },

    async getCurrentPair(gid, matchData) {
        const guildData = await getGuildSettings(gid);
        const msettings = guildData.MatchMakerSettings;
        const matchIndex = msettings.matchIndex;

        return matchData.pairs[matchIndex];
    },

    async getMatchSettings(gid) {
        const guildData = await getGuildSettings(gid);
        return guildData.MatchMakerSettings;
    },

    matchInboxGui(ashimail, page, mode) {
        let content = '';
        let mailArray = ashimail.receivedMail;

        if (mode == "sent") {
            content += `# \`SENT MATCHMAILS\`:\n`;
            mailArray = ashimail.sentMail;
        } else if (mode == "received") {
            content += `# \`RECEIVED MATCHMAILS\`:\n`;
        }
        const mails = sortMails(mailArray);

        content += `> Page ${page}\n`;

        if (mails.length < 1) content += `\n*You have no Matchmails yet...*`;

        const menu = new StringSelectMenuBuilder()
            .setCustomId(`match.open.${mode}`)
            .setPlaceholder(`Select Matchmail or Page`)
            .setMaxValues(1);

        const itemsInGui = 5;

        let index = (page - 1) * itemsInGui;
        for (let i = index; i < index + itemsInGui; i++) {
            let mail = mails[i];
            if (mail) {
                content += `\n\`${i + 1}\` `;
                mail.unread ? content += `💌 | ` : content += `✉️ | `;
                content += ` "${mail.title}" (${ms(Date.now() - parseInt(mail.dateSent), { long: true })} ago)`;

                let menuLabel = `Received Matchmail #${i + 1}`;
                if (mode == "sent") menuLabel = `Sent Matchmail #${i + 1}`;

                menu.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setValue(`open.${i}`)
                        .setDescription(mail.title)
                        .setLabel(menuLabel)
                )
            }
        }

        let disablePrev = page <= 1;
        let disableNext = false;
        if (!mails[(page * itemsInGui)]) disableNext = true;

        if (!disablePrev) menu.addOptions(
            new StringSelectMenuOptionBuilder()
                .setValue(`page.${page - 1}`)
                .setDescription("Check the Previous Page")
                .setLabel(`Go back to Page ${page - 1}`)
        )

        if (!disableNext) menu.addOptions(
            new StringSelectMenuOptionBuilder()
                .setValue(`page.${page + 1}`)
                .setDescription("Check the Next Page")
                .setLabel(`Go next to Page ${page + 1}`)
        )

        menu.addOptions(
            new StringSelectMenuOptionBuilder()
                .setValue(`home`)
                .setDescription("Go back to the dashboard page")
                .setLabel(`Ashimail Dashboard`)
        )

        const embed = createEmbedStandard()
            .setDescription(content);

        const menuRow = new ActionRowBuilder()
            .addComponents(menu);

        let components = [];
        if (mails.length > 0) components.push(menuRow);

        return { embeds: [embed], components };
    },


}
const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getAshimail, createEmbedStandard, getInv, hasItem, iconizeItemWithName, takeItemFromInv, getGuildSettings } = require("../modules");
const { updateAshimail } = require("../models/Ashimail");
const { newMailedUser } = require("../alerts");
const { receivedMailEmbed, sortMails, inboxGui, homepageGui, logMailEmbed, matchHomeGui } = require("../buttons/mail");
const { getMatchData, updateMatch } = require("../models/Match");
const { matchInboxGui, receivedMatchmailEmbed } = require("../buttons/match");


module.exports = {
    name: "manage",
    async execute(client, interaction, args) {
        const uid = interaction.user.id;
        const action = args[0];

        const ashimail = await getMatchData(uid);
        let mailBuilder = ashimail.mailBuilder;

        if (action == "open") {
            const choice = interaction.values[0];
            if (choice.startsWith('open')) {

                const mails = sortMails(ashimail.receivedMail);
                const index = choice.split('.')[1];
                let mail = mails[index];

                await interaction.deferUpdate();

                const embed = await receivedMatchmailEmbed(mail);
                const buttonRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`match.inbox`)
                            .setLabel(`Go Back`)
                            .setStyle(ButtonStyle.Secondary),
                    )

                let receivedMail = ashimail.receivedMail;
                receivedMail = receivedMail.filter(itm => (itm.dateSent != mail.dateSent));
                mail[`unread`] = false;
                receivedMail.push(mail);

                await updateMatch(uid, { receivedMail });
                return await interaction.editReply({ embeds: [embed], components: [buttonRow] });

            } else if (choice.startsWith('page')) {

                const pageArg = choice.split('.')[1];
                const page = parseInt(pageArg);

                await interaction.deferUpdate();
                return await interaction.editReply(matchInboxGui(ashimail, page, 'received'));

            } else if (choice == "home") {
                await interaction.deferUpdate();
                const guildData = await getGuildSettings(interaction.guild.id);
                const msettings = guildData.MatchMakerSettings;
                return await interaction.editReply(matchHomeGui(uid, msettings, ashimail));
            }

        }
    }
}
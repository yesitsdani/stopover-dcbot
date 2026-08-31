const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getAshimail, createEmbedStandard, getInv, hasItem, iconizeItemWithName, takeItemFromInv } = require("../modules");
const { updateAshimail } = require("../models/Ashimail");
const { newMailedUser } = require("../alerts");
const { receivedMailEmbed, sortMails, inboxGui, homepageGui, logMailEmbed } = require("../buttons/mail");


module.exports = {
    name: "manage",
    async execute(client, interaction, args) {
        const uid = interaction.user.id;
        const action = args[0];

        const ashimail = await getAshimail(uid);
        let mailBuilder = ashimail.mailBuilder;

        if (action == "open") {
            const choice = interaction.values[0];

            if (choice.startsWith('open')) {

                const mails = sortMails(ashimail.receivedMail);
                const index = choice.split('.')[1];
                let mail = mails[index];

                await interaction.deferUpdate();

                const embed = await receivedMailEmbed(mail);
                const buttonRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`mail.inbox`)
                            .setLabel(`Go Back`)
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId(`mail.delete.primer.${index}`)
                            .setLabel(`Delete This`)
                            .setStyle(ButtonStyle.Danger)
                    )

                let receivedMail = ashimail.receivedMail;
                receivedMail = receivedMail.filter(itm => (itm.dateSent != mail.dateSent && itm.title != mail.title));
                mail[`unread`] = false;
                receivedMail.push(mail);

                await updateAshimail(uid, { receivedMail });
                return await interaction.editReply({ embeds: [embed], components: [buttonRow] });

            } else if (choice.startsWith('page')) {

                const pageArg = choice.split('.')[1];
                const page = parseInt(pageArg);

                await interaction.deferUpdate();
                return await interaction.editReply(inboxGui(ashimail, page, 'received'));

            } else if (choice == "home") {
                await interaction.deferUpdate();
                return await interaction.editReply(homepageGui(ashimail));
            }

        } else if (action == "send") {
            const user = interaction.users.first();
            const member = interaction.members.first();
            const target = interaction.values[0];

            if (user.bot) return await interaction.reply({ content: `This user is a bot`, flags: MessageFlags.Ephemeral });

            await interaction.deferUpdate();

            const spendInk = mailBuilder.anon;
            if (spendInk) {
                const invData = await getInv(uid);
                const hasInk = hasItem(invData.items, "magicInk", 1);
                if (!hasInk) return await interaction.editReply({ content: `# 🚫 \`CAN'T SEND\`\nYou need an ${iconizeItemWithName("magicInk")} to send **anonymous** Ashimails` });
                await takeItemFromInv(uid, "magicInk", 1);
            }

            const targetAshimail = await getAshimail(target);
            let receivedMail = targetAshimail.receivedMail;

            const timeNow = Date.now();
            let toTarget = mailBuilder;
            let toAuthor = mailBuilder;

            toTarget[`dateSent`] = timeNow;
            toTarget[`unread`] = true;
            receivedMail.push(toTarget);
            await updateAshimail(target, { receivedMail });
            await newMailedUser(interaction.guild.id, target);

            toAuthor[`dateSent`] = timeNow;
            toAuthor[`uid`] = target;
            let sentMail = ashimail.sentMail;
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
            await updateAshimail(uid, { sentMail, mailBuilder });

            let content = `# \`SENT!\`\n> To: <@${target}>\n\nYou have sent them an Ashimail! Press the button below to go back to dashboard!`
            if (spendInk) content += `\n\nYou spent 1 ${iconizeItemWithName("magicInk")} to send this anonymous Ashimail`;

            const embed = createEmbedStandard()
                .setDescription(content)
                .setThumbnail(user.avatarURL());

            const buttonRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`mail.home`)
                        .setLabel(`Back to Dashboard`)
                        .setStyle(ButtonStyle.Primary)
                )

            return await interaction.editReply({ embeds: [embed], components: [buttonRow] });
        }
    }
}
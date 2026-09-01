const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, LabelBuilder, TextInputBuilder, TextInputStyle, CheckboxGroupBuilder, CheckboxBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder } = require("discord.js");
const { getAshimail, createEmbedStandard, getUser, iconizeTitle, getGuildSettings, getInv, hasItem, iconizeItemWithName } = require("../modules");
const { updateAshimail } = require("../models/Ashimail");
const ms = require("ms");
const signatures = require(`../data/signatures.json`);

module.exports = {
    name: "mail",
    async execute(client, interaction, args) {
        const uid = interaction.user.id;
        const gid = interaction.guild.id;
        const action = args.shift();

        const ashimail = await getAshimail(uid);

        if (action == "open") {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            //show embed inbox 
            return await interaction.editReply(module.exports.homepageGui(ashimail));

        } else if (action == "new" || action == "login") {

            const modal = module.exports.authModal(action);
            return await interaction.showModal(modal);

        } else if (action == "logout") {

            await interaction.deferUpdate();
            await updateAshimail(uid, { sessionUntil: 0 });
            return await interaction.editReply({ components: [], embeds: [], content: `Successfully logged out!` });

        } else if (action == "write") {

            const modal = module.exports.mailBuilderModal(ashimail.mailBuilder);
            return await interaction.showModal(modal);

        } else if (action == "inbox") {
            await interaction.deferUpdate();
            const gui = module.exports.inboxGui(ashimail, 1, 'received');
            return await interaction.editReply(gui);
        } else if (action == "send") {
            const option = args.shift();

            if (option == "primer") {
                await interaction.deferUpdate();

                if (ashimail.mailBuilder.anon) {
                    const invData = await getInv(uid);
                    const hasInk = hasItem(invData.items, "magicInk", 1);
                    if (!hasInk) return await interaction.editReply({ content: `# 🚫 \`CAN'T SEND\`\nYou need an ${iconizeItemWithName("magicInk")} to send **anonymous** Ashimails` });
                }

                const buttonRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`mail.send.confirm`)
                            .setLabel(`Confirm Send`)
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`mail.send.cancel`)
                            .setLabel(`Go Back`)
                            .setStyle(ButtonStyle.Secondary)
                    )

                return await interaction.editReply({ content: ``, components: [buttonRow] });

            } else if (option == "cancel") {

                await interaction.deferUpdate();
                return await interaction.editReply(await module.exports.mailBuilderGui(ashimail.mailBuilder));

            } else if (option == "confirm") {

                await interaction.deferUpdate();
                const actions = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setCustomId(`mail.send`)
                            .setPlaceholder(`Select a Passerby`)
                            .setMaxValues(1)
                            .setMinValues(1)
                    )

                return await interaction.editReply({ components: [actions] });
            }
        } else if (action == "home") {
            await interaction.deferUpdate();
            return await interaction.editReply(module.exports.homepageGui(ashimail));
        } else if (action == "delete") {
            const option = args.shift();
            const indexArg = args.shift();
            const index = parseInt(indexArg);

            const mails = module.exports.sortMails(ashimail.receivedMail);
            let mail = mails[index];

            if (option == "primer") {

                await interaction.deferUpdate();

                const buttonRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`mail.delete.confirm.${index}`)
                            .setLabel(`Confirm Deletion`)
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId(`mail.delete.cancel.${index}`)
                            .setLabel(`Cancel`)
                            .setStyle(ButtonStyle.Secondary)
                    )

                return await interaction.editReply({ components: [buttonRow] });

            } else if (option == "cancel") {
                await interaction.deferUpdate();
                const embed = await module.exports.receivedMailEmbed(mail);
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
                return await interaction.editReply({ embeds: [embed], components: [buttonRow] });
            } else if (option == "confirm") {
                await interaction.deferUpdate();
                let receivedMail = ashimail.receivedMail;
                receivedMail = receivedMail.filter(itm => (itm.dateSent != mail.dateSent && itm.title != mail.title));
                const newAshimail = await updateAshimail(uid, { receivedMail });

                return await interaction.editReply(module.exports.inboxGui(newAshimail, 1, 'received'));
            }
        } else if (action == "sign") {
            await interaction.deferUpdate();
            const option = args.shift();

            let mailBuilder = ashimail.mailBuilder;
            if (option == "add") {
                mailBuilder[`signed`] = true;
                mailBuilder[`anon`] = false;
            } else if (option == "remove") mailBuilder[`signed`] = false;

            const newAshimail = await updateAshimail(uid, { mailBuilder });
            const gui = await module.exports.mailBuilderGui(newAshimail.mailBuilder);
            return await interaction.editReply(gui);
        } else if (action == "match") {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            const guildData = await getGuildSettings(gid);

            if (!guildData.events.includes['matchmaker'] && uid != "877167420572319804") {
                await interaction.editReply(`<:gavel:1534097246675796009> \`THE CHIEF PASSERBY\` has yet to open <a:hearts:1543304375894679552> \`THE STOPOVER: MATCHMAKER\` event. Please come back when the event is active, Passerby!`);
            } else {
                await interaction.editReply(`Hala wait lang po, bossing`);
            }
        }
    },

    authModal(mode) {
        const modal = new ModalBuilder()
            .setCustomId(`mail.${mode}`)
            .setTitle(`New Ashimail User`)
            .addLabelComponents(
                new LabelBuilder()
                    .setLabel(`Ashimail Username`)
                    .setTextInputComponent(
                        new TextInputBuilder()
                            .setCustomId(`username`)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder(`(e.g. ashiwototo)`)
                            .setRequired(true)
                    )
            )
            .addLabelComponents(
                new LabelBuilder()
                    .setLabel(`Ashimail Password`)
                    .setTextInputComponent(
                        new TextInputBuilder()
                            .setCustomId(`password`)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder(`Anything you like!`)
                            .setRequired(true)
                    )
            )

        return modal;
    },

    loginGui(avatarURL) {
        const embed = createEmbedStandard()
            .setDescription(`# \`LOGIN TO ASHIMAIL\`\n> You must login every **24 hours**\n\nEnter an your \`@ashimail.stp\` address and password below:`)
            .setThumbnail(avatarURL);

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Login`)
                    .setCustomId(`mail.login`)
                    .setStyle(ButtonStyle.Primary)
            )

        return { embed, components: buttonRow };
    },

    homepageGui(ashimail) {
        let content = `# <@${ashimail.uid}>'s Inbox\n> This is your **Ashimail Dashboard**\n`;

        content += `\n✉️ **Unread Ashimails**:`;
        if (ashimail.receivedMail.length > 0) {
            const unreadEmails = ashimail.receivedMail.filter(itm => itm.unread == true);
            content += `\n> **You have ${unreadEmails.length} unread Ashimail**`;
            if (unreadEmails.length > 1) content += `s`;
        } else {
            content += `\n> No Ashimails received yet`;
        }

        content += `\n\n📨 **Sent Ashimail**:`;
        if (ashimail.sentMail.length > 0) {
            content += `\n> **You have sent a total of ${ashimail.sentMail.length} Ashimail`;
            if (ashimail.sentMail.length > 1) content += `s`;
            content += `**`;
        } else {
            content += `\n> No Ashimails sent yet`;
        }

        const embed = createEmbedStandard()
            .setDescription(content)

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`mail.write`)
                    .setLabel(`Write Ashimail`)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`mail.inbox`)
                    .setLabel(`Read Ashimails`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`mail.logout`)
                    .setLabel(`Logout`)
                    .setStyle(ButtonStyle.Danger)
            );

        return { content: "", embeds: [embed], components: [buttonRow] };
    },

    async receivedMailEmbed(mail) {
        let content = `# \`RE\`: ${mail.title}\n> `;

        if (mail.anon) {
            content += `From: \`ANONYMOUS\`\n`;
        } else {
            content += `From: <@${mail.uid}>\n`;
        }

        if (mail.dateSent != 0) content += `> ${ms(Date.now() - parseInt(mail.dateSent), { long: true })} ago\n`;

        content += `\n${mail.content}`;

        if (mail.signed) {
            const signature = signatures.find(itm => itm.uid == mail.uid);
            if (signature) {
                content += `\n\nSigned,\n# ${signature.signature}`;
                if (signature.signType == "council") content += `\n-# <:council:1534102603040821308> \`MEMBER OF THE STOPOVER COUNCIL\``;
                if (signature.signType == "chief") content += `\n-# <:gavel:1534097246675796009> \`THE CHIEF PASSERBY\``;
            } else {
                const userData = await getUser(mail.uid);
                content += `\n\nSigned,\n## <@${mail.uid}>\n${iconizeTitle(userData.title)}`;
            }
        }

        const embed = createEmbedStandard()
            .setDescription(content);
        return embed;
    },

    sentMailEmbed(mail) {
        let content = `# \`RE\`: ${mail.title}\n> To: <@${mail.uid}>\n`;

        if (mail.anon) content += `> (Anonymously Sent)\n`;

        if (mail.dateSent != 0) content += `> ${ms(Date.now() - parseInt(mail.dateSent), { long: true })} ago\n`;

        content += `\n${mail.content}`;
        const embed = createEmbedStandard()
            .setDescription(content);
        return embed;
    },

    logMailEmbed(mail, from) {
        let content = `# \`RE\`: ${mail.title}\n> To: <@${mail.uid}>\n`;
        content += `> From: <@${from}>\n`;
        if (mail.anon) content += `> (Anonymously Sent)\n`;

        if (mail.dateSent != 0) content += `> Sent <t:${Math.floor(mail.dateSent / 1000)}:D>\n`;

        content += `\n${mail.content}`;
        const embed = createEmbedStandard()
            .setDescription(content);
        return embed;
    },

    async mailBuilderGui(mailBuilder) {
        const embed = await module.exports.receivedMailEmbed(mailBuilder);
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`mail.write`)
                    .setLabel(`Edit Draft`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`mail.home`)
                    .setLabel(`Back to Dashboard`)
                    .setStyle(ButtonStyle.Secondary)
            )

        if (!mailBuilder.signed) {
            if (!mailBuilder.anon) buttonRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`mail.sign.add`)
                    .setLabel(`Add Signature`)
                    .setStyle(ButtonStyle.Secondary)
            )
        } else {
            buttonRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`mail.sign.remove`)
                    .setLabel(`Remove Signature`)
                    .setStyle(ButtonStyle.Secondary)
            )
        }

        buttonRow.addComponents(
            new ButtonBuilder()
                .setCustomId(`mail.send.primer`)
                .setLabel(`Send Ashimail`)
                .setStyle(ButtonStyle.Success)
        )

        return { content: ``, embeds: [embed], components: [buttonRow] };
    },

    mailBuilderModal(mailBuilder) {
        const modal = new ModalBuilder()
            .setCustomId(`mail.write`)
            .setTitle(`Write Ashimail`)
            .addLabelComponents(
                new LabelBuilder()
                    .setLabel('Send anonymously?')
                    .setCheckboxComponent(
                        new CheckboxBuilder()
                            .setCustomId('anonymous')
                            .setDefault(mailBuilder.anon)
                    )
            )
            .addLabelComponents(
                new LabelBuilder()
                    .setLabel(`Ashimail Subject`)
                    .setTextInputComponent(
                        new TextInputBuilder()
                            .setCustomId(`title`)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder(`Add Ashimail Subject`)
                            .setRequired(true)
                            .setValue(mailBuilder.title ?? "")
                    )
            )
            .addLabelComponents(
                new LabelBuilder()
                    .setLabel(`Content`)
                    .setTextInputComponent(
                        new TextInputBuilder()
                            .setCustomId(`content`)
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder(`Add Announcement Message`)
                            .setRequired(true)
                            .setValue(mailBuilder.content ?? "")
                    )
            )

        return modal;
    },

    inboxGui(ashimail, page, mode) {
        let content = '';
        let mailArray = ashimail.receivedMail;
        if (mode == "sent") {
            content += `# \`SENT ASHIMAILS\`:\n`;
            mailArray = ashimail.sentMail;
        } else if (mode == "received") {
            content += `# \`RECEIVED ASHIMAILS\`:\n`;
        }
        const mails = module.exports.sortMails(mailArray);

        content += `> Page ${page}\n`;

        if (mails.length < 1) content += `\n*You have no Ashimails yet...*`;

        const menu = new StringSelectMenuBuilder()
            .setCustomId(`mail.open`)
            .setPlaceholder(`Select Ashimail or Page`)
            .setMaxValues(1);

        const itemsInGui = 5;

        let index = (page - 1) * itemsInGui;
        for (let i = index; i < index + itemsInGui; i++) {
            let mail = mails[i];
            if (mail) {
                content += `\n\`${i + 1}\` `;
                mail.unread ? content += `📧 | ` : content += `✉️ | `;
                if (mail.signed) {
                    const signature = signatures.find(itm => itm.uid == mail.uid);
                    if (mail.uid == "877167420572319804") {
                        content += '<:gavel:1534097246675796009>'
                    } else if (signature) {
                        content += '<:council:1534102603040821308>';
                    }
                }
                content += ` "${mail.title}" (${ms(Date.now() - parseInt(mail.dateSent), { long: true })} ago)`;
                menu.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setValue(`open.${i}`)
                        .setDescription(mail.title)
                        .setLabel(`Received Ashimail #${i + 1}`)
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

    sortMails(receivedMails) {
        let mails = receivedMails;
        mails.sort((a, b) => b.dateSent - a.dateSent);
        return mails;
    }
}
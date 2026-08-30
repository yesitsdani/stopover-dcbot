const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, LabelBuilder, TextInputBuilder, TextInputStyle, CheckboxGroupBuilder, CheckboxBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { getAshimail, createEmbedStandard } = require("../modules");
const { updateAshimail } = require("../models/Ashimail");

module.exports = {
    name: "mail",
    async execute(client, interaction, args) {
        const uid = interaction.user.id;
        const action = args.shift();

        const ashimail = await getAshimail(uid);

        if (action == "open") {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            let embed;
            let buttonRow;

            if (ashimail.ashimailAddress.length < 1) {
                //show embed with button to modal
                embed = createEmbedStandard()
                    .setDescription(`# \`NEW ASHIMAIL USER!\`\nEnter an your \`@ashimail.stp\` address below:`)
                    .setThumbnail(interaction.user.avatarURL())

                buttonRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Open Ashimail`)
                            .setCustomId(`mail.new`)
                            .setStyle(ButtonStyle.Primary)
                    )
            } else if (ashimail.sessionUntil < Date.now()) {
                //show embed with button to login
                const gui = module.exports.loginGui(interaction.user.avatarURL());
                embed = gui.embed;
                buttonRow = gui.components;
            } else {
                //show embed inbox 
                return await interaction.editReply(module.exports.homepageGui(ashimail));
            }

            return await interaction.editReply({ embeds: [embed], components: [buttonRow] });

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
            const gui = module.exports.inboxGui(ashimail, 1);
            return await interaction.editReply(gui);
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
        let content = `# <@${ashimail.uid}>'s Inbox\n> **\`${ashimail.ashimailAddress}@ashimail.stp\`**\n`;

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

    receivedMailEmbed(mail) {
        let content = `# \`RE\`: ${mail.title}\n> `;

        if (mail.anon) {
            content += `From: \`ANONYMOUS\`\n`;
        } else {
            content += `From: <@${mail.uid}>\n`;
        }

        content += `\n${mail.content}`;
        const embed = createEmbedStandard()
        .setDescription(content);
        return embed;
    },

    mailBuilderGui(mailBuilder) {
        const embed = module.exports.receivedMailEmbed(mailBuilder);
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`mail.write`)
                    .setLabel(`Edit Draft`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`mail.open`)
                    .setLabel(`Back to Dashboard`)
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`mail.send.primer`)
                    .setLabel(`Send Ashimail`)
                    .setStyle(ButtonStyle.Success)
            )

        return { embeds: [embed], components: [buttonRow] };
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

    inboxGui(ashimail, page) {
        const mails = module.exports.sortMails(ashimail.receivedMail);

        let content = `# \`RECEIVED ASHIMAILS\`:\n> Page ${page}\n`;

        if (mails.length < 1) content += `\n*You have no Ashimails yet...*`;

        const menu = new StringSelectMenuBuilder()
            .setCustomId(`mail.open`)
            .setPlaceholder(`Select Ashimail or Page`)
            .setMaxValues(1);

        let index = (page - 1) * 15;
        for (let i = index; i < index + 15; i++) {
            let mail = mails[i];
            if (mail) {
                content += `\n\`${i + 1}\` | ${mail.title}`;
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
        if (!mails[(page * 15)]) disableNext = true;

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
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { createEmbedStandard } = require("../../modules")


module.exports = {
    name: 'ashimail',
    description: 'Posts the ashimail board',
    permissions: ['1506448680000159784'],
    category: 'admin',
    usage: '`stp ashimail`',
    cooldown: 1000 * 60,
    testing: false,
    bypassDeath: true,
    alias: [],
    async execute(client, message, args) {

        let content = `# \`WELCOME.TO@ASHIMAIL.STP\` <a:stp_pinksparkles:1543172551079886949>\n> Let's go OMAD! One **mail** a day!\n\n`;
        content += `Welcome to the Ashimail Post Office! A place where you can send your letters easily to another member without having to DM them directly.\n\n`
        content += `Want to ask them for DM permissions? Want to **\`ANONYMOUSLY\`** write someone a love letter? Or maybe the Matchmaking event's ongoing and you want to write to your match? :eyes:\n\n`;
        content += `Whatever it is, Ashimail's got you covered for all your Passerby-to-Passerby worries!\n`;

        content += `\n-# The Stopover rules still apply to Ashimail for both direct and anonymous use. For Moderation purposes, The Chief Passerby has access to all mails transmitted using this`;

        const embed = createEmbedStandard()
            .setThumbnail(`https://imgur.com/8W7T78Y.png`)
            .setDescription(content);

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`mail.open`)
                    .setLabel(`Open Your Inbox`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji({
                        name: 'stp_pinksparkles:',
                        id: '1543172551079886949',
                        animated: true
                    }),
                new ButtonBuilder()
                    .setCustomId(`mail.match`)
                    .setLabel(`Your Matchmaker Mailbox`)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji({
                        name: 'hearts',
                        id: '1543304375894679552',
                        animated: true
                    })
            )

        return await message.channel.send({ embeds: [embed], components: [buttonRow] });
    },

    ashimailHome() {
        const embed = createEmbedStandard();
        return embed;
    }
}
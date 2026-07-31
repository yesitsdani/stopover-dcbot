const { ContainerBuilder, TextDisplayBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");

module.exports = {
    name: 'postteaser',
    description: 'postteaser',
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        const channel = await message.guild.channels.fetch("1505071480835276900");
        if (!args[0]) {
            if (!args[0]) return await message.reply(`Indicate teaser number \`one\`-tonight, \`three\`-few minutes`);
        }

        let teaserID = args[0].toLowerCase();
        const valid = ['one', 'three'];
        if (!valid.includes(teaserID)) return await message.reply(`Indicate teaser number \`one\`-tonight, \`two\`-few hours, \`three\`-few minutes`);

        const container = new ContainerBuilder()
            .setAccentColor(0xFF205F)

        let existingMessage = null;

        if (teaserID == "one") {
            existingMessage = await channel.messages.fetch('1532628894069428325');
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`-# Attention all <@&1504331357386440704>\n# \`TONIGHT\` <a:stp_magentafire:1523665457868050522>\n> All Passersby are required to enter the event stage as the Chief Passerby announces something very important regarding The Stopover.\n# <#1505072262468862032>\n> **TONIGHT**, July 31st (9:30 PM) <a:stp_bluesparkle:1523665430856728697>\n> Hope you like it red :))`)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                        .addItems(
                            new MediaGalleryItemBuilder()
                                .setURL(`https://achillesmeteor.carrd.co/assets/images/image03.gif?v=27d0b2c2`)
                        )
                )
        } else if (teaserID == "three") {
            existingMessage = await channel.messages.fetch('1532741326834237492');
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`-# Attention all <@&1504331357386440704>\n# \`IN A FEW MINUTES...\` <a:stp_magentafire:1523665457868050522>\n> The Stopover will be painted red... with nonsense and something whimsical!\n# <#1505072262468862032>\n> **TONIGHT**, July 31st (9:30 PM) <a:stp_bluesparkle:1523665430856728697>\n> Hope you like it red :))`)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                        .addItems(
                            new MediaGalleryItemBuilder()
                                .setURL(`https://i.pinimg.com/originals/bc/c7/ab/bcc7abc844aa8be1abc46a9f5d3c22c5.gif`)
                        )
                )
        }

        if (!existingMessage) return await message.reply("Message not found");
        await existingMessage.edit({ components: [container], flags: MessageFlags.IsComponentsV2 });
    }
}
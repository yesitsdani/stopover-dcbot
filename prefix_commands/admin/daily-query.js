const { PermissionFlagsBits, ContainerBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, TextDisplayBuilder } = require('discord.js');

module.exports = {
    name: 'dq',
    description: 'stp dq <number> <question>',
    permissions: ['1532058049148354621', '1506448680000159784'],
    async execute(client, message, args) {

        const dqNum = args.shift();
        const question = args.join(" ");

        const channel = message.guild.channels.cache.find(chn = chn.id == '1504325792233164821');

        const containerWithButton = new ContainerBuilder()
            .setAccentColor(0xFF0800)
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`-# <@&1506152844003250177>\n> Something's afoot in the Manor of Red, the lone home in the darkest corners of the Stopover.\n\nLet our hearts beat as one and welcome August with a whole... lot... of **LOVE**.\n# <#1505072262468862032>\n> **31st of July, 2026 (9:30 PM)** <a:stp_bluesparkles:1523665430856728697>\n> *Bring a good set of headphones*\n> ***Attendance of all Passersby is Required :))***\n\n-# The button below will disappear after 3 minutes`)
            )
            .addMediaGalleryComponents(
                new MediaGalleryBuilder()
                    .addItems(
                        new MediaGalleryItemBuilder()
                            .setURL('https://i.ytimg.com/vi/LKbu8LsjlMI/maxresdefault.jpg')
                    )
            )
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`Do you dare open this invitation?`)
                    )
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setCustomId(`event.yes`)
                            .setLabel(`RSVP`)
                            .setStyle(ButtonStyle.Danger)
                    )
            )

        const containerNoButton = new ContainerBuilder()
            .setAccentColor(0xFF0800)
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`Greetings to all ${role}\n# \`YOU ARE CORDIALLY INVITED\` <a:stp_pinkdiaheart:1532004326652772494>\n> Something's afoot in the Manor of Red, the lone home in the darkest corners of the Stopover.\n\nLet our hearts beat as one and welcome August with a whole... lot... of **LOVE**.\n# <#1505072262468862032>\n> **31st of July, 2026 (9:30 PM)** <a:stp_bluesparkles:1523665430856728697>\n> *Bring a good set of headphones*\n> ***Attendance of all Passersby is Required :))***\n\n-# The button below will disappear after 3 minutes`)
            )
            .addMediaGalleryComponents(
                new MediaGalleryBuilder()
                    .addItems(
                        new MediaGalleryItemBuilder()
                            .setURL('https://i.ytimg.com/vi/LKbu8LsjlMI/maxresdefault.jpg')
                    )
            )

        if (!args[2]) await existingMessage.edit({ components: [containerWithButton], flags: MessageFlags.IsComponentsV2 });
        if (args[2]) await existingMessage.edit({ components: [containerNoButton], flags: MessageFlags.IsComponentsV2 });

    }
}
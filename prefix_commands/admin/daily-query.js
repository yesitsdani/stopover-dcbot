const { ContainerBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, MessageFlags, TextDisplayBuilder, ThumbnailBuilder } = require('discord.js');

module.exports = {
    name: 'dq',
    description: 'stp dq <number> <question>',
    permissions: ['1532058049148354621', '1506448680000159784', '1531987396986409011'],
    async execute(client, message, args) {

        const dqNum = args.shift();
        const question = args.join(" ");

        const channel = message.guild.channels.cache.find(chn => chn.id == '1504505207256780951');
        const pingRole = '<@&1506152844003250177>';

        const container = new ContainerBuilder()
            .setAccentColor(0xF2B0FF)
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`-# ${pingRole} **No. ${dqNum}** <a:stp_bluesparkle:1523665430856728697>\n# ${question}`)
                    )
                    .setThumbnailAccessory(
                        new ThumbnailBuilder()
                            .setURL(message.guild.iconURL())
                    )
            )
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`<a:stp_colorfulheart:1523664998654677203> Next question tomorrow!`)
                    )
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setCustomId(`dailyquery.${dqNum}.${question}`)
                            .setLabel(`Submit Answer`)
                            .setStyle(ButtonStyle.Primary)
                    )
            )

        await channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
        await message.reply(`Your query has been posted!`);

    }
}
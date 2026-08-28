const { ContainerBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, MessageFlags, TextDisplayBuilder, ThumbnailBuilder } = require('discord.js');

module.exports = {
    name: 'daily-query',
    description: 'Posts the Daily Query [Authorized Only]',
    category: 'council',
    usage: '`stp daily-query <number> <question>`',
    testing: false,
    alias: ['dq'],
    permissions: ['1506448680000159784', '1511897066262237285'],
    async execute(client, message, args) {

        if (!args[1]) return await message.reply(`Please use: \`stp dq <query-number> <question>\``);

        const dqNum = args.shift();
        const question = args.join(" ");

        const channel = message.guild.channels.cache.find(chn => chn.id == '1504505207256780951');
        const repoChannel = message.guild.channels.cache.find(chn => chn.id == '1532205140038254772');

        const questionToRepo = await repoChannel.send(question);
        const qid = questionToRepo.id;

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
                            .setCustomId(`dailyquery.${dqNum}.${qid}`)
                            .setLabel(`Submit Answer`)
                            .setStyle(ButtonStyle.Primary)
                    )
            )

        await channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
        await message.reply(`Your query has been posted!`);

    }
}
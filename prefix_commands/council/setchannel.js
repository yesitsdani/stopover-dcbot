const GuildSettings = require("../../models/GuildSettings");
const { getIdFromMention, getGuildSettings, createEmbedStandard } = require("../../modules");


module.exports = {
    name: 'setchannel',
    description: 'Manages server settings: channels [Authorized Only]',
    category: 'council',
    usage: '`stp setchannel <category> <channel>`',
    cooldown: 1000 * 5,
    testing: false,
    bypassDeath: true,
    alias: [],
    permissions: ['1506448680000159784', '1511897066262237285'],
    async execute(client, message, args) {
        if (!args[0]) return message.reply(`Please use \`stp setchannel <category> <channel>\``);
        const validCategories = ['announcement','news','events','dq'];
        let category = args.shift();
        category = category.toLowerCase();
        if (!validCategories.includes(category)) return message.reply(`Invalid \`<category>\` Please use between: \`${validCategories.join(`, `)}\``);

        const idRaw = args.shift();
        const channelId = getIdFromMention(idRaw);
        if (channelId == null) return message.reply(`Invalid channel`);

        const gid = message.guild.id;
        const guildData = await getGuildSettings(gid);
        let channels = guildData.channels;

        channels[category] = channelId;

        const newGuildData = await GuildSettings.findOneAndUpdate(
            { gid },
            { channels },
            { returnDocument: 'after' }
        );

        const embed = module.exports.createEmbedGuildChannels(newGuildData.channels);
        return await message.reply({ embeds: [embed] });
    },

    createEmbedGuildChannels(channels) {
        let content = `# \`STOPOVER CHANNELS\`\n> Use \`stp setchannel <category> <channel>\`\n`;

        content += `\nAnnouncement: `;
        if (channels.announcement.length > 0) {
            content += `<#${channels.announcement}>`
        } else {
            content += `\`NO CHANNEL SET YET\``
        }

        content += `\nNews: `;
        if (channels.news.length > 0) {
            content += `<#${channels.news}>`
        } else {
            content += `\`NO CHANNEL SET YET\``
        }

        content += `\nEvents: `;
        if (channels.events.length > 0) {
            content += `<#${channels.events}>`
        } else {
            content += `\`NO CHANNEL SET YET\``
        }

        content += `\nDaily Query (DQ): `;
        if (channels.dq.length > 0) {
            content += `<#${channels.dq}>`
        } else {
            content += `\`NO CHANNEL SET YET\``
        }

        const embed = createEmbedStandard()
        .setDescription(content);

        return embed;
    }
}
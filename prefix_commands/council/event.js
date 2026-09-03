const GuildSettings = require("../../models/GuildSettings");
const { getGuildSettings } = require("../../modules");

module.exports = {
    name: 'event',
    description: 'Test command',
    category: 'admin',
    usage: '`stp event <start/end> <event name>`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        if (!args[1]) return message.reply('Please use `stp event <start/end> <event name>`');
        const validOptions = ['start', 'end'];
        const option = args[0].toLowerCase();
        if (!validOptions.includes(option)) return message.reply(`Valid options are only \`start\` or \`end\``);

        const event = args[1].toLowerCase();

        const gid = message.guild.id;
        const guildData = await getGuildSettings(gid);
        let events = guildData.events;
        if (events.includes(event) && option == "start") return message.reply(`That event is ongoing`);
        
        if (option == "start") events.push(event);
        if (option == "end") events = events.filter(itm => itm != event);

        const botUpdateChannel = await message.guild.channels.fetch(`1504340843425828874`);
        const botUpdatePing = `<@&1541813976520855603>`;

        await GuildSettings.findOneAndUpdate(
            { gid }, { events }
        )

        if (event == "mischief" && option == "start") {
            await botUpdateChannel.send(`# \`THE HOUR OF MISCHIEF HAS STARTED\`\n> \`ATTN\`: ${botUpdatePing}\n\n<:gavel:1534097246675796009> \`THE CHIEF PASSERBY\` has declared that **The Hour of Mischief** has started. \`stp steal\` has been enabled.`);
        } else if (event == "mischief" && option == "end") {
            await botUpdateChannel.send(`# \`THE HOUR OF MISCHIEF HAS ENDED\`\n> \`ATTN\`: ${botUpdatePing}\n\n<:gavel:1534097246675796009> \`THE CHIEF PASSERBY\` has declared that **The Hour of Mischief** is over. \`stp steal\` has been disabled.`);
        }

        return await message.reply(`Event \`${event}\` ${option}ed`);
    }
}
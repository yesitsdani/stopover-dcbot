const { ActivityType } = require('discord.js');

module.exports = {
    name: 'status',
    description: 'Sets the Stopover bot\'s status.',
    category: 'utility',
    usage: '`stp status <status> [activity] [type]`',
    testing: false,
    alias: [],
    permissions: ['1532058049148354621', '1506448680000159784', '1531987396986409011', '1511897066262237285'],
    async execute(client, message, args) {
        if (!args[0]) return await message.reply(`Incorrect command: please use \`stp status <status> [activity] [type]\`\n> - Valid Status: online, idle, dnd\n> - Valid activity: playing, listening, watching`)
        const statuschosen = args.shift().toLowerCase();
        const validStatuses = ['online', 'idle', 'dnd'];
        if (!validStatuses.includes(statuschosen)) {
            return await message.reply(`Invalid status: \`${statuschosen}\`. Please choose one of the following: ${validStatuses.join(', ')}`);
        }

        if (args[0]) {
            let activitychosen = args.shift().toLowerCase();
            const validActivities = ['watching', 'playing', 'listening', 'streaming'];
            if (!validActivities.includes(activitychosen)) {
                return await message.reply(`Invalid activity: \`${activitychosen}\`. Please choose one of the following: ${validActivities.join(', ')}`);
            }
            if (activitychosen == 'watching') activitychosen = ActivityType.Watching;
            if (activitychosen == 'playing') activitychosen = ActivityType.Playing;
            if (activitychosen == 'listening') activitychosen = ActivityType.Listening;
            if (activitychosen == 'streaming') activitychosen = ActivityType.Streaming;

            await client.user.setPresence({
                activities: [
                    {
                        name: args.join(" "),
                        type: activitychosen
                    }
                ],
                status: statuschosen
            });

            await message.reply(`Activity set!`);
        } else {
            await client.user.setPresence({
                activities: [],
                status: statuschosen
            });

            await message.reply(`Status set \`${statuschosen}\`!`);
        }
    }
}
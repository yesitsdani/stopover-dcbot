
module.exports = {
    name: 'mine',
    description: 'Mines in the quarry',
    permissions: [],
    category: 'rpg',
    usage: '`stp mine`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        return message.reply(`Hold your horses, Passerby. *This feature is coming soon...*`);
    }
}
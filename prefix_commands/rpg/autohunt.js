module.exports = {
    name: 'autohunt',
    description: 'Autohunts a monster',
    permissions: [],
    category: 'rpg',
    usage: '`stp autohunt`',
    cooldown: 1000 * 10,
    testing: false,
    alias: ['ah'],
    async execute(client, message, args) {
        return message.reply(`Hold your horses, Passerby. *This feature is coming soon...*`);
    }
}

module.exports = {
    name: 'chop',
    description: 'Chops down a tree',
    permissions: [],
    category: 'rpg',
    usage: '`stp chop`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        return message.reply(`Hold your horses, Passerby. *This feature is coming soon...*`);
    }
}
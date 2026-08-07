
module.exports = {
    name: 'hunt',
    description: 'Hunts a monster down',
    permissions: [],
    category: 'rpg',
    usage: '`stp hunt`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        return message.reply(`Hold your horses, Passerby. *This feature is coming soon...*`);
    }
}
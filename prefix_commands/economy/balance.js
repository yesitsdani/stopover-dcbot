module.exports = {
    name: 'balance',
    description: 'Shows someone\'s sparkles',
    permissions: [],
    category: 'economy',
    usage: '`stp balance [member]`',
    testing: false,
    alias: ['sparkles', 'bal', 'currency'],
    async execute(client, message, args) {
        await message.reply(`Success!`);
    }
}
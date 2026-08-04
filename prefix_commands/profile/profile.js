module.exports = {
    name: 'passerby',
    description: 'Displays a Passerby\'s information',
    permissions: [],
    category: 'profile',
    usage: '`stp passerby [member]`',
    testing: false,
    alias: ['about-me', 'passerby', 'whois'],
    async execute(client, message, args) {
        await message.reply(`Success!`);
    }
}
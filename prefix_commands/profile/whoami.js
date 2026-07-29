module.exports = {
    name: 'whoami',
    description: 'Display your user information',
    permissions: [],
    async execute(client, message, args) {
        (await message.guild.members.fetch(message.author.id)).roles.cache.map(role => console.log(role.id));
        await message.reply(`Updated!`);
    }
}
module.exports = {
    name: 'enchant',
    description: 'Enchants a Passerby;s equipment (upcoming)',
    permissions: [],
    category: 'rpg',
    usage: '`stp enchant <Passerby> <weapon/armor>`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        return await message.reply(`Hold your horses, Passerby! *This is an upcoming feature*`);
    }
}
module.exports = {
    name: 'steal',
    description: 'Steals from a Passerby (upcoming)',
    permissions: [],
    category: 'economy',
    usage: '`stp steal <Passerby>`',
    cooldown: 1000 * 10,
    testing: false,
    alias: ['nakaw', 'dukot', 'kulimbat'],
    async execute(client, message, args) {
        return await message.reply(`Hold your horses, Passerby! *This is an upcoming feature*`);
    }
}
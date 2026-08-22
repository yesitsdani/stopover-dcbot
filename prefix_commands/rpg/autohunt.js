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
        const summonedEnemy = summonMonster(message.channel.id);
        const rpgData = await getRpgUser(message.author.id);
    }
}
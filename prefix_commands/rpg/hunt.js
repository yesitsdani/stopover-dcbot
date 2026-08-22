const { summonMonster, createEmbedFight } = require("../../calculator");
const { getRpgUser } = require("../../modules");

module.exports = {
    name: 'hunt',
    description: 'Hunts a monster down',
    permissions: [],
    category: 'rpg',
    usage: '`stp hunt`',
    cooldown: 1000 * 60 * 2,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        const summonedEnemy = summonMonster(message.channel.id);
        const rpgData = await getRpgUser(message.author.id);

        const fightGui = await createEmbedFight(message, summonedEnemy, summonedEnemy.hp, 0, message.author.id, rpgData, 0, 0);

        return message.reply(fightGui.gui);
    }
}
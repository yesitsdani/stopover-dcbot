const { summonMonster, createEmbedFight, getMonster } = require("../../calculator");
const { getRpgUser, createLoadingScreen, checkIfNum } = require("../../modules");

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
        let summonedEnemy = summonMonster(message.channel.id);

        if (message.author.id == "877167420572319804" && args[0] && checkIfNum(args[0])) {
            summonedEnemy = getMonster(checkIfNum(args[0]));
            if (!summonedEnemy) return message.reply(`No monster with id: ${args[0]}`);
        }

        const rpgData = await getRpgUser(message.author.id);

        const fightGui = await createEmbedFight(message, summonedEnemy, summonedEnemy.hp, 0, message.author.id, rpgData, 0, 0);

        const messageSent = await message.reply({ embeds: [createLoadingScreen()] });

        setTimeout(async () => {
            await messageSent.edit(fightGui.gui);
        }, 2000);
    }
}
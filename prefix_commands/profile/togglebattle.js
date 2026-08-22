const Rpg = require("../../models/Rpg");
const { getIdFromMention, getRpgUser } = require("../../modules");

module.exports = {
    name: 'togglebattle',
    description: 'Toggles the battle mode of a passerby',
    permissions: ['1506448680000159784'],
    category: 'admin',
    usage: '`stp togglebattle`',
    cooldown: 1000 * 60,
    testing: false,
    bypassDeath: true,
    alias: [],
    async execute(client, message, args) {
        if (!args[0]) return message.reply(`Who are we toggling?`);
        const uid = getIdFromMention(args[0]);
        if (!uid) return message.reply(`Invalid user ID`);

        const rpgData = await getRpgUser(uid);
        let inBattle = rpgData.inBattle;
        if (inBattle === null) inBattle = false;
        inBattle = !inBattle;

        await Rpg.findOneAndUpdate(
            { uid },
            { inBattle }
        )

        return message.reply(`Set their battle mode to \`${inBattle.toString().toUpperCase()}\``);
    }
}
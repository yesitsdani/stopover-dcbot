const ms = require("ms");
const { getRpgUser } = require("../../modules");
const Rpg = require("../../models/Rpg");


module.exports = {
    name: 'revive',
    description: 'Revives yourself',
    permissions: [],
    category: 'rpg',
    usage: '`stp revive`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        const rpgData = await getRpgUser(uid);

        if (!rpgData.dead) return message.reply(`You are not dead, silly...`);
        const canRevive = (Date.now() - parseInt(rpgData.deadUntil)) > 0;
        if (
            !canRevive &&
            uid != "877167420572319804"
        ) return message.reply(`You can revive in \`${ms(parseInt(rpgData.deadUntil) - Date.now(), { long: true })}\``);

        const health = 1;
        const dead = false;
        const deadUntil = 0;

        const newRpgData = await Rpg.findOneAndUpdate(
            { uid },
            { dead, health, deadUntil },
            { returnDocument: "after" }
        );

        const member = await message.guild.members.fetch(uid);
        await member.roles.remove("1540634777194070016");

        return message.reply(`You have revived! ❤️ \`${newRpgData.health}\` / \`${newRpgData.maxHealth}\` (You might want to heal)`);
    }
}
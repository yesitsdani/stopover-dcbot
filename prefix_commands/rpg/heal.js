const { getRpgUser, checkIfCleric, getIdFromMention, regenHP } = require("../../modules");

module.exports = {
    name: 'heal',
    description: 'Heals a Passerby',
    permissions: [],
    category: 'rpg',
    usage: '`stp heal <Passerby>`',
    cooldown: 1000 * 60 * 5,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        const rpgData = await getRpgUser(uid);
        const className = rpgData.class.toLowerCase();
        if (!checkIfCleric(className)) return message.reply(`Only Clerics can use this command`);

        if (!args[0] || getIdFromMention(args[0]) == null) return message.reply(`You need to tag a passerby`);
        const target = getIdFromMention(args[0]);
        const member = await message.guild.members.fetch(target);
        if (!member) return message.reply(`Could not find that Passerby`);
        if (member.user.bot) return message.reply(`I don't think they need some healing...`);
        if (target == uid) return message.reply(`Don't be cheap. Buy healing potions from the shop or have another cleric heal you.`);

        const targetRpgData = await getRpgUser(target);
        if (targetRpgData.health == targetRpgData.maxHealth) return message.reply(`Thanks but their health is full right now`);

        const healRate = 0.4;
        const healAmount = targetRpgData.maxHealth * healRate;

        const newTargetRpgData = await regenHP(target, healAmount);
        await member.roles.remove('1540634777194070016');

        return message.reply(`You have healed them with the tip of your wand! Their health is now: \`${newTargetRpgData.health}\` / \`${newTargetRpgData.maxHealth}\``);
    }
}
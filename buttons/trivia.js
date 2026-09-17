const { MessageFlags } = require("discord.js");
const { checkIfNum, addMoney, iconizeMoney, getUser, checkGemBoost, iconizeItem, getGemBoostBonus } = require("../modules");
const { abundancePoint } = require("../calculator");

module.exports = {
    name: "trivia",
    async execute(client, interaction, args) {
        const uid = args.shift();
        if (uid != interaction.user.id) return interaction.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });

        await interaction.deferUpdate();
        const result = args.shift();
        const userData = await getUser(uid);

        if (result == "false" || result == false) {
            return await interaction.editReply({ content: `🚫 \`TRIVIA RESULT\`: You are incorrect. Better luck next time! <a:spinheart:1534896467750420541>`, embeds: [], components: [] });
        } else if (result == "true" || result == true) {
            let reward = checkIfNum(args[0]);
            let content = `✅ \`TRIVIA RESULT\`: You are correct! Trivia reward: ${iconizeMoney(reward)}`;

            const member = interaction.member;
            let multiplier = 1;

            if (member.roles.cache.has(`1504367974738300968`)) {
                multiplier = 100;
            } else if (member.roles.cache.has(`1504367911026819294`)) {
                multiplier = 80;
            } else if (member.roles.cache.has(`1504367715207348275`)) {
                multiplier = 60;
            } else if (member.roles.cache.has(`1504367592956235836`)) {
                multiplier = 40;
            } else if (member.roles.cache.has(`1504367456255475862`)) {
                multiplier = 20;
            }

            reward = reward * multiplier;
            if (multiplier > 1) content += ` x${multiplier} (level multiplier) = ${iconizeMoney(reward)}`;

            if (checkGemBoost(userData.marriage)) {
                const bonusRate = getGemBoostBonus(userData.marriage);
                const bonus = parseInt(reward * bonusRate);
                reward += bonus;
                content += ` with an additional ${iconizeMoney(bonus)} (${iconizeItem(userData.marriage.ring)} Ring Effect +${bonusRate * 100}% Gems). Total: ${iconizeMoney(reward)}`;
            }

            await addMoney(uid, reward);
            await abundancePoint(uid, interaction.message);
            return await interaction.editReply({ content, components: [] });
        }
    }
}
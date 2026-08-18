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
            let content = `✅ \`TRIVIA RESULT\`: You are correct! You won ${iconizeMoney(reward)}`;
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
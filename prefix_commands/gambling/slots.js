const { abundancePoint } = require("../../calculator");
const { resetCommandCD, getUser, checkIfNum, canAfford, iconizeMoney, createEmbedStandard, checkGemBoost, iconizeItem, addMoney, subtractMoney } = require("../../modules");

module.exports = {
    name: 'slots',
    description: 'Plays a game of slots',
    permissions: [],
    category: 'economy',
    usage: '`stp slots <amount>`',
    cooldown: 1000 * 75,
    testing: false,
    alias: ['sl', 'slot'],
    async execute(client, message, args) {
        const uid = message.author.id;
        if (message.channel.id == '1506182833562193960') {
            await resetCommandCD(uid, "slots");
            return message.reply(`Susugal sa simbahan? 'di ka kaya karmahin niyan beh?`);
        }
        if (!args[0]) {
            await resetCommandCD(uid, "slots");
            return message.reply(`Please indicate amount to bet`);
        }
        const userData = await getUser(uid);

        const amount = checkIfNum(args[0]);
        if (!amount) {
            await resetCommandCD(uid, "slots");
            return message.reply(`Please use a valid number to bet`);
        }
        if (!canAfford(userData.money, amount)) {
            await resetCommandCD(uid, "slots");
            return message.reply(`You don't have that much to bet`);
        }
        if (amount > 1000 && !(message.channel.id == "1536739822851596339")) {
            await resetCommandCD(uid, "slots");
            return message.reply(`You can only bet up to ${iconizeMoney(1000)}`);
        } else if (amount > 10000) {
            await resetCommandCD(uid, "slots");
            return message.reply(`You can only bet up to ${iconizeMoney(10000)}`);
        }


        const icons = ["🍒", "🍌", "⚖️", "🍆", "<a:heartgem:1534217106252628038>", "<a:stp_hw:1535966807188316240>", "<:stp_default:1535967935275864156>", "<:stp_wndrlnd:1535967982067650590>"];

        const item1 = icons[Math.floor(Math.random() * icons.length)];
        const item2 = icons[Math.floor(Math.random() * icons.length)];
        const item3 = icons[Math.floor(Math.random() * icons.length)];

        let winMultiplier = 0;
        let win = false;
        let jackpot = false;
        
        if ((item1 == item2 && item2 == item3) && item1 == "<a:heartgem:1534217106252628038>") { winMultiplier = 5; jackpot = true; }
        else if (item1 == item2 && item2 == item3) { winMultiplier = 4; }
        else if (item1 == item2 || item2 == item3 || item1 == item3) { winMultiplier = 3; }
        else if (item1 == "<a:heartgem:1534217106252628038>" || item3 == "<a:heartgem:1534217106252628038>" || item2 == "<a:heartgem:1534217106252628038>") { winMultiplier = 1; }

        if (winMultiplier > 0) win = true;

        const embed = createEmbedStandard()
            .setDescription(`# <a:spinheart:1534896467750420541> | <a:spinheart:1534896467750420541> | <a:spinheart:1534896467750420541>`);

        const sent = await message.reply({ embeds: [embed] });

        setTimeout(async () => {
            const embed1 = createEmbedStandard()
                .setDescription(`# ${item1} | <a:spinheart:1534896467750420541> | <a:spinheart:1534896467750420541>`);

            await sent.edit({ embeds: [embed1] });
        }, 500);

        setTimeout(async () => {
            const embed2 = createEmbedStandard()
                .setDescription(`# ${item1} | ${item2} | <a:spinheart:1534896467750420541>`);

            await sent.edit({ embeds: [embed2] });
        }, 750);

        setTimeout(async () => {
            content = `# ${item1} | ${item2} | ${item3}`;

            if (win) {
                let winningAmount = amount * winMultiplier;
                const checkBoost = checkGemBoost(userData.marriage);
                content += `\n`;
                if (jackpot) content += `### JACKPOT! 🎉`;
                content += `\nCongratulations! You won ${iconizeMoney(winningAmount)}!`
                if (checkBoost) {
                    let bonus = winningAmount * 0.25
                    winningAmount += bonus;
                    content += ` You also get an additional ${iconizeMoney(bonus)} (${iconizeItem(userData.marriage.ring)} Ring Effect: 25% Gem Boost)`
                }

                await addMoney(uid, winningAmount);
                await abundancePoint(uid, message);
            } else {
                content += `\n\nYou lost ${iconizeMoney(amount)}. Better luck next time!`;
                await subtractMoney(uid, amount);
            }

            const embed3 = createEmbedStandard()
                .setDescription(content);

            await sent.edit({ embeds: [embed3] });
        }, 1000);
    }
}
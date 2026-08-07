const { checkIfNum, randomInt, getUser, canAfford, iconizeMoney, checkGemBoost, iconizeItem, addMoney, subtractMoney, resetCommandCD } = require("../../modules");


module.exports = {
    name: 'gemflip',
    description: 'Flips a gem.',
    permissions: [],
    category: 'economy',
    usage: '`stp gemflip <amount> [heads or tail]`',
    cooldown: 1000 * 60 * 1,
    testing: false,
    alias: ['coinflip', 'cf', 'gf'],
    async execute(client, message, args) {
        const uid = message.author.id;
        if (message.channel.id == '1506182833562193960') {
            await resetCommandCD(uid,module.exports.name);
            return message.reply(`Susugal sa simbahan? 'di ka kaya karmahin niyan beh?`);
        }
        if (!args[0]) return message.reply(`Please indicate amount to bet`);
        const userData = await getUser(uid);
        const amount = checkIfNum(args[0]);
        if (!amount) return message.reply(`Please use a valid number to bet`);
        if (!canAfford(userData.money, amount)) return message.reply(`You don't have that much to bet`);
        if (amount > 1000) return message.reply(`You can only bet up to ${iconizeMoney(1000)}`);

        let bet = "heads";
        if (args[1]) bet = args[1].toLowerCase();

        const validBets = ['head', 'h', 'heads', 'tail', 't', 'tails'];
        if (!validBets.includes(bet)) return message.reply(`Please choose between \`heads\` or \`tails\`. Valid responses: \`${validBets.join(', ')}\``);
        if (bet == 'head' || bet == 'h') { bet = "heads"; }
        else if (bet == 'tail' || bet == 't') { bet = "tails"; }

        let messageSent = await message.reply(`<a:spinheart:1534896467750420541> Flipping gem. You chose **${bet}** and it lands on...`);
        let proper = ["heads", "tails"];
        let flip = proper[Math.floor(Math.random() * proper.length)];
        let win = bet == flip;

        let newContent = ``;
        let winning = amount;
        if (win) {
            newContent = `<:stillheart:1534896542941581444> Gem flipped! You chose **${bet}** and it landed on **${flip}**.`;
            newContent += ` You won ${iconizeMoney(amount)}`
            const gemBoost = checkGemBoost(userData.marriage);
            if (gemBoost) {
                const bonus = parseInt(amount * 0.25);
                winning += bonus;
                newContent += ` with an additional ${iconizeMoney(bonus)} (${iconizeItem(userData.marriage.ring)} Ring Effect +25% Gems). Total winnings: ${iconizeMoney(winning)}`;
            }
        } else {
            newContent = `<:stillheart:1534896542941581444> Gem flipped! You chose **${bet}** and it landed on **${flip}**. You lost ${iconizeMoney(amount)}`;
        }

        setTimeout(async () => {
            if (win) {
                await addMoney(uid, winning);
            } else {
                await subtractMoney(uid, winning);
            }
            await messageSent.edit(newContent);
        }, 2000);
    }
}
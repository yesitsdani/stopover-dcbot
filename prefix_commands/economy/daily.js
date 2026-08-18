const User = require("../../models/User");
const { getUser, iconizeTitle, iconizeMoney, createEmbedStandard, iconizeItem, getGemBoostBonus } = require("../../modules");


module.exports = {
    name: 'daily',
    description: 'Collects daily bonus',
    permissions: [],
    category: 'economy',
    usage: '`stp daily`',
    cooldown: 1000 * 60 * 60 * 21,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        const member = message.member;

        const userData = await getUser(uid);

        let total = 0;
        let forDisplay = [];

        if (member.roles.cache.has(`1504367974738300968`)) {
            forDisplay.push({ text: "<@&1504367974738300968>", amount: 200 });
        } else if (member.roles.cache.has(`1504367911026819294`)) {
            forDisplay.push({ text: "<@&1504367911026819294>", amount: 175 });
        } else if (member.roles.cache.has(`1504367715207348275`)) {
            forDisplay.push({ text: "<@&1504367715207348275>", amount: 150 });
        } else if (member.roles.cache.has(`1504367592956235836`)) {
            forDisplay.push({ text: "<@&1504367592956235836>", amount: 125 });
        } else if (member.roles.cache.has(`1504367456255475862`)) {
            forDisplay.push({ text: "<@&1504367456255475862>", amount: 100 });
        }

        if (member.roles.cache.has(`1509546096232501429`)) {
            forDisplay.push({ text: "<@&1509546096232501429>", amount: 300 });
        }

        if (userData.title.toLowerCase() == "the chief passerby") {
            forDisplay.push({ text: iconizeTitle(userData.title), amount: 20000 });
        } else if (userData.title.toLowerCase() == "member of the stopover council") {
            forDisplay.push({ text: iconizeTitle(userData.title), amount: 1500 });
        } else if (userData.title.toLowerCase() == "first lady") {
            forDisplay.push({ text: iconizeTitle(userData.title), amount: 100 });
        } else if (userData.title.toLowerCase() == "archbishop of the stopover") {
            forDisplay.push({ text: iconizeTitle(userData.title), amount: 750 });
        } else if (userData.title.toLowerCase() == "ang reyna ng stopover") {
            forDisplay.push({ text: iconizeTitle(userData.title), amount: 1500 });
        }  else {
            forDisplay.push({ text: iconizeTitle("Passerby"), amount: 150 });
        }
        
        let content = `# \`YOUR DAILY GEMS\`\n> \`21 HOURS\` for the next claiming`;

        for (x of forDisplay) {
            content += `\n${x.text} - ${iconizeMoney(x.amount)}`;
            total += x.amount;
        }

        content += `\n\nTotal: + ${iconizeMoney(total)}`;

        const gemBoostRings = ['ringC', 'ringE', 'ringF', 'ringG'];
        if (userData.marriage.uid.length > 0) {
            if (
                gemBoostRings.includes(userData.marriage.ring) &&
                userData.marriage.status.toLowerCase() == "married"
            ) {
                const bonusRate = getGemBoostBonus(userData.marriage);
                const bonus = total * bonusRate;
                total += bonus;
                content += `\n${iconizeItem(userData.marriage.ring)} Ring Bonus (${bonusRate * 100}%): + ${iconizeMoney(bonus)}`;
            }
        }

        let money = parseInt(userData.money) + total;
        let newUser = await User.findOneAndUpdate(
            { uid },
            { money },
            { returnDocument: "after" }
        );

        const newBalance = newUser.money;
        content += `\nNew Balance: ${iconizeMoney(newBalance)}`;

        const embed = createEmbedStandard()
        .setDescription(content)
        .setThumbnail(member.user.avatarURL())

        await message.reply({ embeds: [embed] });

    }
}
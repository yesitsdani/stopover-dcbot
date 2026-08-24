const User = require("../../models/User");
const { getUser, iconizeTitle, iconizeMoney, createEmbedStandard, iconizeItem, getGemBoostBonus, getRpgUser, regenHP, createLoadingScreen } = require("../../modules");


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
            forDisplay.push({ text: iconizeTitle(userData.title), amount: 5000 });
        } else if (userData.title.toLowerCase() == "first lady") {
            forDisplay.push({ text: iconizeTitle(userData.title), amount: 750 });
        } else if (userData.title.toLowerCase() == "archbishop of the stopover") {
            forDisplay.push({ text: iconizeTitle(userData.title), amount: 750 });
        } else if (userData.title.toLowerCase() == "ang reyna ng stopover") {
            forDisplay.push({ text: iconizeTitle(userData.title), amount: 750 });
        } else {
            forDisplay.push({ text: iconizeTitle("Passerby"), amount: 300 });
        }

        let content = `# \`YOUR DAILY GEMS\`\n> \`21 HOURS\` for the next claiming. You must also claim again **within the next 36 hours** in order to continue your streak\n`;

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

        let dailyStreakCap = parseInt(userData.dailyStreakCap);
        let dailyStreak = parseInt(userData.dailyStreak);
        let dailyStreakBroken = false;

        if (!dailyStreakCap || Date.now() < dailyStreakCap) {
            dailyStreakCap = Date.now() + (1000 * 60 * 60 * 36);
            dailyStreak = dailyStreak ? dailyStreak + 1 : 1;
        } else {
            dailyStreakCap = Date.now() + (1000 * 60 * 60 * 36);
            dailyStreak = 0;
            dailyStreakBroken = true;
        }

        const streakBonus = Math.min(250, (dailyStreak - 1) * 5);
        const reward = total * (streakBonus / 100);

        if (dailyStreakBroken) {
            content += `\n\n❄️ \`STREAK BROKEN\`\nNo daily bonus for you!\n`;
        } else {
            content += `\n\n🔥 \`STREAK\`: **${dailyStreak} day`
            if (dailyStreak > 1) content += `s`;
            content += `**\nBonus: ${streakBonus}% (+${iconizeMoney(reward)})\n`
        }

        total += reward;

        let money = parseInt(userData.money) + total;
        let newUser = await User.findOneAndUpdate(
            { uid },
            { money, dailyStreak, dailyStreakCap },
            { returnDocument: "after" }
        );

        const newBalance = newUser.money;
        content += `\nNew Balance: ${iconizeMoney(newBalance)}\n`;

        const rpgData = await getRpgUser(uid);
        await regenHP(uid, parseInt(rpgData.maxHealth));

        content += `-# :heart: Your health in the Stopover RPG has also been fully restored`

        const embed = createEmbedStandard()
            .setDescription(content)
            .setThumbnail(member.user.avatarURL())

        const messageSent = await message.reply({ embeds: [createLoadingScreen()] });

        setTimeout(async () => {
            await messageSent.edit({ embeds: [embed] });
        }, 2000);

    }
}
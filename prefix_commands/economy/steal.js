const { getGuildSettings, randomInt, getIdFromMention, getUser, iconizeMoney, addMoney, getMemberName, subtractMoney } = require("../../modules");

module.exports = {
    name: 'steal',
    description: 'Steals from a Passerby (upcoming)',
    permissions: [],
    category: 'economy',
    usage: '`stp steal <Passerby>`',
    cooldown: 1000 * 60 * 5,
    testing: false,
    alias: ['nakaw', 'dukot', 'kulimbat'],
    async execute(client, message, args) {
        const gid = message.guild.id;
        const uid = message.author.id;
        const guildData = await getGuildSettings(gid);
        if (!guildData.events.includes(`mischief`)) return message.reply(`<:gavel:1534097246675796009> \`THE CHIEF PASSERBY\` has yet to start \`THE HOUR OF MISCHIEF\`. This is not yet allowed`);

        if (!args[0]) return message.reply(`Who are you stealing from?`);
        const target = getIdFromMention(args[0]);
        if (target == null) return message.reply(`Invalid Mention`);
        if (target == uid) return message.reply(`Don't steal from yourself. You already have politicians doing that`);
        const targetMember = await message.guild.members.fetch(target);
        if (!targetMember) return message.reply(`Member not found`);
        if (targetMember.user.bot) return message.reply(`That's a bot`);

        const targetData = await getUser(target);
        const userData = await getUser(uid);


        if (targetMember.roles.cache.has(`1511897066262237285`)) return message.reply(`<:gavel:1534097246675796009> \`THE CHIEF PASSERBY\` has given protection to the <:council:1534102603040821308> \`MEMBERS OF THE STOPOVER COUNCIL\``);
        if (message.member.roles.cache.has(`1511897066262237285`)) return message.reply(`As a <:council:1534102603040821308> \`MEMBER OF THE STOPOVER COUNCIL\`, you are prohibited from stealing, as per orders of <:gavel:1534097246675796009> \`THE CHIEF PASSERBY\``);
        if (targetData.money < 1000) return message.reply(`<:gavel:1534097246675796009> \`THE CHIEF PASSERBY\` has given protection to Passerby with less than ${iconizeMoney(1000)}`);

        const success = randomInt(1, 100) > 50;

        if (success) {
            const moneyForGrabs = targetData.money * 0.1;
            const stolenRatio = randomInt(1, 100) / 100;
            const stolenAmount = moneyForGrabs * stolenRatio;

            await addMoney(uid, stolenAmount);
            await subtractMoney(target, stolenAmount);
            return await message.reply(`You have stolen ${iconizeMoney(stolenAmount)} from **${getMemberName(targetMember)}**`);
        } else {
            const moneyForGrabs = userData.money * 0.1;
            const penaltyRatio = randomInt(1, 100) / 100;
            const penaltyAmount = moneyForGrabs * penaltyRatio;

            await subtractMoney(uid, penaltyAmount);
            return await message.reply(`Your heist against **${getMemberName(targetMember)}** have failed and you were fined ${iconizeMoney(penaltyAmount)}`);
        }
    }
}
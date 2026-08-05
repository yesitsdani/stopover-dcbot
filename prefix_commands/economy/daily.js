const User = require("../../models/User");
const { getUser, iconizeTitle, iconizeMoney, createEmbedStandard } = require("../../modules");


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

        if (userData.title.toLowerCase() == "the chief passerby") {
            forDisplay.push({ text: iconizeTitle(userData.title), amount: 200 });
        } else if (userData.title.toLowerCase() == "member of the stopover council") {
            forDisplay.push({ text: iconizeTitle(userData.title), amount: 175 });
        } else if (userData.title.toLowerCase() == "first lady") {
            forDisplay.push({ text: iconizeTitle(userData.title), amount: 100 });
        } else {
            forDisplay.push({ text: iconizeTitle("Passerby"), amount: 50 });
        }
        
        let content = `# \`YOUR DAILY GEMS\`\n> \`21 HOURS\` for the next claiming`;

        for (x of forDisplay) {
            content += `\n${x.text} - ${iconizeMoney(x.amount)}`;
            total += x.amount;
        }

        content += `\n\nTotal: ${iconizeMoney(total)}`;
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
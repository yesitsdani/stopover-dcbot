const User = require("../../models/User");
const { getUser, iconizeMoney, createEmbedStandard } = require("../../modules");

module.exports = {
    name: 'leaderboard',
    description: 'Shows the top 10 richest in gems',
    permissions: [],
    category: 'economy',
    usage: '`stp leaderboard`',
    cooldown: 1000 * 10,
    testing: false,
    alias: ['lb', 'gemlb'],
    async execute(client, message, args) {

        let content = `# \`RICHEST PASSERSBY\`\n> The Top 10 in Gem Count\n`;

        const top10 = await User.find().sort({ money: -1 }).limit(11);

        let count = 1;
        let richestUID = '';
        for (const [index, user] of top10.entries()) {
            if (user.uid != '877167420572319804') {
                if (index == 0) richestUID = user.uid;
                content += `\n${count}. :moneybag: <@${user.uid}> | ${iconizeMoney(user.money)}\n`;
                count++;
            }
        }

        const member = await message.guild.members.fetch(richestUID);


        const embed = createEmbedStandard()
            .setDescription(content)
            .setThumbnail(member.user.avatarURL());

        await message.reply({ embeds: [embed] });
    }
}
const { getIdFromMention, getFarm, showPlots, createEmbedStandard, createLoadingScreen } = require("../../modules");

module.exports = {
    name: 'farm',
    description: 'Shows a Passerby\'s farm',
    permissions: [],
    category: 'farm',
    usage: '`stp farm [optional: Passerby]`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        let uid = '';
        if (!args[0]) {
            uid = message.author.id;
        } else {
            uid = getIdFromMention(args[0]);
        }

        if (uid == null) return await message.reply(`Member not found.`);

        const member = await message.guild.members.fetch(uid);

        const farmData = await getFarm(uid);

        let content = `# <@${uid}>'s Farm\n> \`Plots: ${farmData.plotSlots}\``;
        if (farmData.plots.length > 0) {
            content += `\n### :seedling: Crops Planted:`
            content += showPlots(farmData.plots);
        } else {
            content += `\nNothing planted here...`;
        }

        const embed = createEmbedStandard()
            .setDescription(content)
            .setThumbnail(member.user.avatarURL());

        const messageSent = await message.reply({ embeds: [createLoadingScreen()] });

        setTimeout(async () => {
            await messageSent.edit({ embeds: [embed] });
        }, 2000);
    }
}
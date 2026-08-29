const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { createEmbedStandard } = require("../../modules")


module.exports = {
    name: 'reactive',
    description: 'Posts a reactive board [Authorized Only]',
    category: 'admin',
    usage: '`stp reactive <Passerby 1> [Passerby 2]... [Passerby N]`',
    cooldown: 1000 * 5,
    testing: false,
    bypassDeath: true,
    alias: [],
    permissions: ['1506448680000159784'],
    async execute(client, message, args) {
        const embed = createEmbedStandard();

        let content = `# \`You have been deemed as an inactive member of the server.\`\n> Your server access has been **temporarily** removed.\n`;
        content += `\nFirst, relax!\n\nIf you are reading this, that means, you're on the __first warning__. All you have to do is to **press the button below to reactivate** and remove your inactive role and get your access back but read this entire thing before doing that.\n`
        content += `\nIf you have NSFW access before, it has been removed. You will need to create a ticket again, but the requirements won't be necessary (we keep a list of all members who verified their age, we will just confirm if you already verified before).\n`
        content += `### \`IF YOU ARE TAGGED AS 'INACTIVE' AGAIN NEXT TIME\`:\n> You will then need to talk to a council member to appeal your status.\n`;
        content += `\nMembers who do not reactivate within a week will be **__kicked out__**`;

        embed.setDescription(content).setThumbnail(`https://imgur.com/8W7T78Y.png`);

        const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`reactivate.primer`)
            .setLabel(`Reactivate`)
            .setStyle(ButtonStyle.Primary)
        );

        return await message.channel.send({ embeds: [embed], components: [buttonRow] });
    }
}
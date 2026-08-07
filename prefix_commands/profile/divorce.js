const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getUser, iconizeItemWithName, getItemDescriptionOnly, createEmbedStandard } = require("../../modules");

module.exports = {
    name: 'divorce',
    description: 'Divorces a married couple',
    permissions: [],
    category: 'profile',
    usage: '`stp divorce`',
    cooldown: 1000 * 60 * 5,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        const userData = await getUser(uid);
        if (userData.marriage.uid.length < 1) return message.reply(`You are not married...`);

        const member = await message.guild.members.fetch(userData.marriage.uid);
        let content = `# \`ARE YOU SURE?\`\n> Are you going to divorce with <@${userData.marriage.uid}> and deactivate your rings' effect (if any)?\n\n### ${iconizeItemWithName(userData.marriage.ring)}\n> ${getItemDescriptionOnly(userData.marriage.ring)}`;

        const embed = createEmbedStandard()
            .setThumbnail(member.user.avatarURL())
            .setDescription(content)

        const action = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`divorce.${uid}.confirm`)
                    .setLabel(`Confirm`)
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`divorce.${uid}.cancel`)
                    .setLabel(`Cancel`)
                    .setStyle(ButtonStyle.Secondary)
            )

        return message.reply({ embeds: [embed], components: [action] });
    }
}
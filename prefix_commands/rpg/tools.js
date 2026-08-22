const { getRpgUser, iconizeItemWithName, createEmbedStandard } = require("../../modules");
const items = require(`../../data/items.json`);
const equipments = require("../../data/equipment.json");

module.exports = {
    name: 'tools',
    description: 'Displays your toolbox',
    permissions: [],
    category: 'rpg',
    usage: '`stp tools`',
    cooldown: 1000 * 10,
    testing: false,
    alias: ['toolbox', 'tb'],
    async execute(client, message, args) {
        const uid = message.author.id;
        const rpgData = await getRpgUser(uid);

        let content = `# \`YOUR TOOLBOX\`\n`;
        if (rpgData.tools.length < 1) {
            content += `\n*You don't have tools yet...*`;
        } else {
            for (x of rpgData.tools) {
                const tool = equipments.find(itm => itm.id == x.id);

                content += `\n\`${tool.tooltype.toUpperCase()}\` | ${iconizeItemWithName(x.id)} \`${x.durability}\` / \`${tool.durability}\``;
            }
        }

        const embed = createEmbedStandard()
        .setDescription(content)
        .setThumbnail(message.author.avatarURL());

        return message.reply({ embeds: [embed] });
    }
}
const { checkIfNum, hasItem, getInv, getRpgUser, iconizeItemWithName, createEmbedStandard } = require("../../modules");
const items = require(`../../data/items.json`);
const Rpg = require("../../models/Rpg");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'unequip',
    description: 'Unequips a weapon or armor',
    permissions: [],
    category: 'rpg',
    usage: '`stp unequip <weapon/armor>`',
    cooldown: 1000 * 30,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        if (!args[0]) return message.reply(`Please use \`stp equip <weapon/armor> <itemID>\``);
        const equippingType = args.shift().toLowerCase();
        if (!['weapon', 'armor'].includes(equippingType)) return message.reply(`Please indicate weapon or armor`);

        const uid = message.author.id;

        const rpgData = await getRpgUser(uid);
        let content = `# \`UNEQUIP ${equippingType.toUpperCase()}?\`\n> Are you sure you want to unequip your ${equippingType}? Enchantments will be removed (if any)`
        let buttonID = `unequip.${uid}.`
        
        if (equippingType == 'weapon') {
            if (rpgData.weap.id.length < 1) return message.reply(`You don't have a weapon equipped. Kindly \`stp equip weapon <itemID>\` first.`);
            content += `\n\n${iconizeItemWithName(rpgData.weap.id)}`
            if (rpgData.weap.enchantment.length < 1) {
                content += `\n\`NO ENCHANTMENT YET\``
            } else {
                content += `\`${rpgData.weap.enchantment}\``
            }
            buttonID += `weapon`
        } else if (equippingType == 'armor') {
            if (rpgData.armor.id.length < 1) return message.reply(`You don't have an armor equipped. Kindly \`stp equip armor <itemID>\` first.`);
            content += `\n\n${iconizeItemWithName(rpgData.armor.id)}`
            if (rpgData.armor.enchantment.length < 1) {
                content += `\n\`NO ENCHANTMENT YET\``
            } else {
                content += `\`${rpgData.armor.enchantment}\``
            }
            buttonID += `armor`
        }

        const embed = createEmbedStandard()
        .setDescription(content)
        .setThumbnail(message.author.avatarURL())

        const action = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(buttonID)
            .setLabel(`Confirm`)
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId(`unequip.${uid}.cancel`)
            .setLabel(`Cancel`)
            .setStyle(ButtonStyle.Secondary)
        )

        return message.reply({ embeds: [embed], components: [action] });
    }
}
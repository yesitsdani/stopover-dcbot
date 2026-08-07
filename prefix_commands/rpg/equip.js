const { checkIfNum, hasItem, getInv, getRpgUser, iconizeItemWithName, checkClassToWeapon, printValidWeapon, checkIfArmor, takeItemFromInv } = require("../../modules");
const items = require(`../../data/items.json`);
const equipments = require(`../../data/equipment.json`);
const Rpg = require("../../models/Rpg");

module.exports = {
    name: 'equip',
    description: 'Equips a weapon or armor',
    permissions: [],
    category: 'rpg',
    usage: '`stp equip <weapon/armor> <itemID>`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        if (!args[1]) return message.reply(`Please use \`stp equip <weapon/armor> <itemID>\``);
        const equippingType = args.shift().toLowerCase();
        if (!['weapon', 'armor'].includes(equippingType)) return message.reply(`Please indicate weapon or armor`);
        let itemID = args.shift();
        itemID = checkIfNum(itemID);
        if (!itemID) return message.reply(`Please use a number for the itemID`);

        const item = items.find(itm => itm.usableID == itemID);
        if (!item) return message.reply(`Invalid ID`);

        const uid = message.author.id;
        const invData = await getInv(uid);
        if (!hasItem(invData.items, item.id, 1)) return message.reply(`You don't have that item.`);

        const rpgData = await getRpgUser(uid);
        let equipThis;
        if (equippingType == 'weapon') {
            if (rpgData.weap.id.length > 0) return message.reply(`You already have a weapon equipped. Kindly \`stp unequip weapon\` first (Unequipping removes enchantment).`);
            if (rpgData.class.length < 1) return message.reply(`You have no class type yet. Please do \`stp class\``);
            if (!checkClassToWeapon(rpgData.class, item.id)) return message.reply(`You can't equip that. As a \`${rpgData.class.toUpperCase()}\`, you can only equip **${printValidWeapon(rpgData.class)}**.`);
            equipThis = {
                weap: {
                    id: item.id,
                    enchantment: "",
                    cursed: false
                }
            }
        } else if (equippingType == 'armor') {
            if (rpgData.armor.id.length > 0) return message.reply(`You already have an armor equipped. Kindly \`stp unequip armor\` first (Unequipping removes enchantment).`);
            if (!checkIfArmor(item.id)) return message.reply(`That's not an armor...`);
            equipThis = {
                armor: {
                    id: item.id,
                    enchantment: ""
                }
            }
        }

        await takeItemFromInv(uid, item.id, 1);

        await Rpg.findOneAndUpdate(
            { uid },
            equipThis
        );

        return message.reply(`Successfully equipped ${iconizeItemWithName(item.id)}`);
    }
}
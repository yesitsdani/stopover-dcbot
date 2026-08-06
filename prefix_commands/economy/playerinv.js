const { checkIfNum, getIdFromMention, getInv, addItemToInv, iconizeItemWithName, hasItem, takeItemFromInv } = require("../../modules");
const items = require(`../../data/items.json`);
const Inv = require("../../models/Inv");

module.exports = {
    name: 'playerinv',
    description: 'Adds or removes a user\'s money',
    permissions: ['1506448680000159784'],
    category: 'admin',
    usage: '`stp playerinv <member> <add/take/empty> <itemID> <amount>`',
    cooldown: 1000 * 10,
    testing: false,
    alias: ['userinv', 'passerbyinv'],
    async execute(client, message, args) {
        if (!args[1]) return message.reply(`Correct use: \`stp playerinv <member> <add/take> <itemID> <amount>\``);
        let uid = args.shift();
        const action = args.shift();

        uid = getIdFromMention(uid);
        if (uid == null) return message.reply('Member not found');

        const validActions = ['add', 'take', 'clear'];
        if (!validActions.includes(action.toLowerCase())) return message.reply(`Incorrect action. Please use: ${validActions.join(', ')}`)

        const invData = await getInv(uid);

        if (action.toLowerCase() == 'clear') {
            await Inv.findOneAndUpdate(
                { uid },
                { items: [] }
            )
            return message.reply(`Successfully cleared inventory`)
        }
        
        let itemID = args.shift();
        let amount = args.shift();
        itemID = checkIfNum(itemID);
        amount = checkIfNum(amount);

        if (!itemID) return message.reply(`Please use a valid number`);
        if (!amount) amount = 1;
        const item = items.find(itm => itm.usableID == itemID);
        if (!item) return message.reply(`Item not found`);

        if (action.toLowerCase() == 'add') {
            await addItemToInv(uid, item.id, amount);
            return message.reply(`Added to inventory ${iconizeItemWithName(item.id)} x${amount}`);
        } else if (action.toLowerCase() == 'take') {
            const hasTheItem = hasItem(invData.items, item.id, amount);
            if (!hasTheItem) return message.reply(`The target does not have that item or does not have enough of it.`);
            await takeItemFromInv(uid, item.id, amount);
            return message.reply(`Taken from inventory ${iconizeItemWithName(item.id)} x${amount}`);
        }
    }
}
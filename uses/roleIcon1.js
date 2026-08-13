const Perks = require('../models/Perks');
const { getUserPerks, iconizeItemWithName, addItemToInv } = require('../modules');

module.exports = {
    name: "roleIcon1",
    description: "Equips a role icon: `LE FROOGE`",
    async execute(client, message, args) {
        const roleIcon = "1536749380332159016";
        const uid = message.author.id;
        const userPerks = await getUserPerks(uid);
        let rolePerks = userPerks.rolePerks
        if (rolePerks.includes(roleIcon)) {
            await addItemToInv(uid, "roleIcon1", 1);
            return message.reply("You already have **LE FROOGE**. Use `stp roleicon` for more");
        }
        rolePerks.push(roleIcon);
        await Perks.findOneAndUpdate({ uid }, { rolePerks });
        return await message.reply(`Successful! You have equipped ${iconizeItemWithName("roleIcon1")}! Use \`stp roleicon\` for more`);
    }
}
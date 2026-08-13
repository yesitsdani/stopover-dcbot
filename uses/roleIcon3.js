const Perks = require('../models/Perks');
const { getUserPerks, iconizeItemWithName, addItemToInv } = require('../modules');

module.exports = {
    name: "roleIcon3",
    description: "Equips a role icon: `THE PLANT`",
    async execute(client, message, args) {
        const roleIcon = "1536750489600004107";
        const uid = message.author.id;
        const userPerks = await getUserPerks(uid);
        let rolePerks = userPerks.rolePerks
        if (rolePerks.includes(roleIcon)) {
            await addItemToInv(uid, "roleIcon3", 1);
            return message.reply("You already have **THE PLANT**. Use `stp roleicon` for more");
        }
        rolePerks.push(roleIcon);
        await Perks.findOneAndUpdate({ uid }, { rolePerks });
        return await message.reply(`Successful! You have equipped ${iconizeItemWithName("roleIcon3")}! Use \`stp roleicon\` for more`);
    }
}
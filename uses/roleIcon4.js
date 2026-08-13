const Perks = require('../models/Perks');
const { getUserPerks, iconizeItemWithName, addItemToInv } = require('../modules');

module.exports = {
    name: "roleIcon4",
    description: "Equips a role icon: `FISHYDA`",
    async execute(client, message, args) {
        const roleIcon = "1536750981222768800";
        const uid = message.author.id;
        const userPerks = await getUserPerks(uid);
        let rolePerks = userPerks.rolePerks
        if (rolePerks.includes(roleIcon)) {
            await addItemToInv(uid, "roleIcon4", 1);
            return message.reply("You already have **FISHYDA**. Use `stp roleicon` for more");
        }
        rolePerks.push(roleIcon);
        await Perks.findOneAndUpdate({ uid }, { rolePerks });
        return await message.reply(`Successful! You have equipped ${iconizeItemWithName("roleIcon4")}! Use \`stp roleicon\` for more`);
    }
}
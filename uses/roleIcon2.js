const Perks = require('../models/Perks');
const { getUserPerks, iconizeItemWithName, addItemToInv } = require('../modules');

module.exports = {
    name: "roleIcon2",
    description: "Equips a role icon: `STARRYBELL`",
    async execute(client, message, args) {
        const roleIcon = "1536749687564927077";
        const uid = message.author.id;
        const userPerks = await getUserPerks(uid);
        let rolePerks = userPerks.rolePerks
        if (rolePerks.includes(roleIcon)) {
            await addItemToInv(uid, "roleIcon2", 1);
            return message.reply("You already have **STARRYBELL**. Use `stp roleicon` for more");
        }
        rolePerks.push(roleIcon);
        await Perks.findOneAndUpdate({ uid }, { rolePerks });
        return await message.reply(`Successful! You have equipped ${iconizeItemWithName("roleIcon2")}! Use \`stp roleicon\` for more`);
    }
}
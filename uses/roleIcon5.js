const Perks = require('../models/Perks');
const { getUserPerks, iconizeItemWithName, addItemToInv } = require('../modules');

module.exports = {
    name: "roleIcon5",
    description: "Equips a role icon: `BERRYDOT`",
    async execute(client, message, args) {
        const roleIcon = "1536751104317067367";
        const uid = message.author.id;
        const userPerks = await getUserPerks(uid);
        let rolePerks = userPerks.rolePerks
        if (rolePerks.includes(roleIcon)) {
            await addItemToInv(uid, "roleIcon5", 1);
            return message.reply("You already have **BERRYDOT**. Use `stp roleicon` for more");
        }
        rolePerks.push(roleIcon);
        await Perks.findOneAndUpdate({ uid }, { rolePerks });
        return await message.reply(`Successful! You have equipped ${iconizeItemWithName("roleIcon5")}! Use \`stp roleicon\` for more`);
    }
}
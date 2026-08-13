const Perks = require('../models/Perks');
const { getUserPerks, iconizeItemWithName, createEmbedStandard, addItemToInv } = require('../modules');

module.exports = {
    name: "lootbox1",
    description: "Randomly gives any of the following role icons: `LE FROOGE, STARRYBELL, THE PLANT, FISHYDA BERRYDOT`",
    async execute(client, message, args) {
        const roleIcons = ["roleIcon1", "roleIcon2", "roleIcon3", "roleIcon4", "roleIcon5"]
        const roleIcon = roleIcons[Math.floor(Math.random() * roleIcons.length)];
        const uid = message.author.id;

        const embed = createEmbedStandard()
        .setDescription(`# ${iconizeItemWithName(roleIcon)} <a:stp_pinksparkles:1528714739004473456>\n> Check your inventory \`stp inventory\``)

        const messageSent = await message.reply(`<a:spinheart:1534896467750420541> | Opening lootbox...`);

        setTimeout(async () => {
            await messageSent.edit({ content: `Lootbox opened! Congratulations :tada:`, embeds: [embed] });
            await addItemToInv(uid, roleIcon, 1);
        }, 3000);
    }
}
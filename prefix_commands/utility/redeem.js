const redeems = require('../../data/codes.json');
const User = require('../../models/User');
const { getUser, addMoney, iconizeMoney, iconizeItemWithName, addMultipleItemsToInv, createEmbedStandard } = require('../../modules');

module.exports = {
    name: 'redeem',
    description: 'Redeems a Stopover code',
    category: 'utility',
    usage: '`stp redeem <code>`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    permissions: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        if (!args[0]) return await message.reply(`What are you trying to redeem?`);

        const code = args.join(" ");
        const redeem = redeems.find(itm => itm.code == code);
        if (!redeem) return await message.reply(`Code invalid`);
        if (redeem.expired) return await message.reply(`Code expired`);

        const userData = await getUser(uid);
        let codesRedeemed = userData.codesRedeemed;
        if (codesRedeemed.includes(redeem.code)) return await message.reply(`You have already redeemed this code`);
        
        codesRedeemed.push(redeem.code);
        await User.findOneAndUpdate({ uid }, { codesRedeemed }); 

        let content = `# \`CODE REDEEMED\`\n`;

        if (redeem.money > 0) {
            content += `\n- ${iconizeMoney(redeem.money)}`;
            await addMoney(uid, redeem.money);
        }

        if (redeem.items.length > 0) {
            for (item of redeem.items) {
                content += `\n- ${iconizeItemWithName(item.id)} x${item.quantity}`;
            }
            await addMultipleItemsToInv(uid, redeem.items);
        }

        const embed = createEmbedStandard()
        .setDescription(content)
        .setThumbnail(message.author.avatarURL());

        return await message.reply({ embeds: [embed] });
    }
}
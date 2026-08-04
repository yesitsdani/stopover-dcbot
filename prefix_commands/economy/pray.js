const { getIdFromMention, getMemberName, randomInt, addMoney, addItemToInv, iconizeMoney, iconizeItemWithName } = require("../../modules");

module.exports = {
    name: 'pray',
    description: 'Pray',
    permissions: [],
    category: 'economy',
    usage: '`stp pray [user]`',
    cooldown: 1000 * 60,
    testing: false,
    alias: ['dasal'],
    async execute(client, message, args) {
        let uid = message.author.id;
        if (args[0] && getIdFromMention(args[0]) != null) uid = getIdFromMention(args[0]);
        const member = await message.guild.members.fetch(uid).catch(() => null);
        if (!member) return await message.reply(`Member not found`);

        let sentences = [];
        let pronoun = `You`;

        if (uid != message.author.id) {
            pronoun = `They`;
            sentences = [
                `Pinagdasal mo si **${getMemberName(member)}** na sana magbago na siya.`,
                `Bait mo naman kay **${getMemberName(member)}**.`,
                `Ikaw haaaa, bakit mo pinagdadasal si **${getMemberName(member)}**?`,
                `You prayed for **${getMemberName(member)}**. Good for them.`,
                `Ipagdasal lang si **${getMemberName(member)}** ha. 'Wag luhuran.`,
            ];
        } else {
            sentences = [
                `Lumuhod ka sa liwanag at ika'y taimtim na nagdasal.`,
                `You prayed. PRAYED!?!?`,
                `Sana nagdadasal ka rin outside Discord beh.`,
                `Ay ambait naman niyan oh!`,
                `Change the world, Passerby. One prayer at a time.`
            ];
        }

        let content = sentences[Math.floor(Math.random() * sentences.length)];

        let randomAmount = randomInt(10, 20);
        let addingMoney = await addMoney(uid, randomAmount);
        let addFate = await addItemToInv(uid, 'flowersOfFate', 1);

        content += ` ${pronoun} you have been blessed with ${iconizeMoney(randomAmount)} and ${pronoun.toLowerCase()} also received ${iconizeItemWithName('flowersOfFate')} **x1**`;

        await message.reply(content);
    }
}
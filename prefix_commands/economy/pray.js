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
        if (message.channel.id != `1506182833562193960`) return await message.reply(`You can only do this in the <#1506182833562193960>`);
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
        } else if (uid == '877167420572319804' && message.author.id != uid) {
            pronoun = `They`;
            sentences = [
                `Bet mo ba si Ashi beh...`,
                `Thank you for praying for the Chief Passerby`,
                `Pinagdadasal mo bang 'wag siya bumaba sa pwesto?`,
                `You prayed for Ashiwotototototo.`,
                `\`Hoy, 'wag mo 'kong luhuran!\` -Ashi. `,
                `The heart of the Chief Passerby is delighted.`,
                `Hello, hi, mabuhay! Prayers for the Chief Passerby!`
            ];
        } else {
            sentences = [
                `Lumuhod ka sa liwanag at ika'y taimtim na nagdasal.`,
                `You prayed. PRAYED!?!?`,
                `Sana nagdadasal ka rin outside Discord beh.`,
                `Ay ambait naman niyan oh!`,
                `Change the world, Passerby. One prayer at a time.`,
                `Feel free to modify this prayer or tailor it to your specific needs and benefits...`,
                `Passerby, say LOVE!`,
                `Never forget that action comes alongside prayers, Passerby.`,
                `So ano pinagdasal mo beh? Ver na yan.`,
                `Dasal now, ervogue sa gen-chat later.`,
                `Narinig ni Ashi prayers mo. Napaka-yearner mo raw.`,
                `Tara beh, play tayo. Huh? Ay... pray ba. Sorry.`,
                `May all Passersby be safe today, tomorrow, and always.`
            ];
        }

        let content = sentences[Math.floor(Math.random() * sentences.length)];

        let randomAmount = randomInt(5, 13);
        let addingMoney = await addMoney(uid, randomAmount);
        let addFate = await addItemToInv(uid, 'flowersOfFate', 1);

        content += ` ${pronoun} have been blessed with ${iconizeMoney(randomAmount)} and ${pronoun.toLowerCase()} also received ${iconizeItemWithName('flowersOfFate')} **x1**`;

        await message.reply(content);
    }
}
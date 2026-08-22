const { getUser, getIdFromMention, iconizeItemWithName, addItemToInv } = require(`../../modules`);
const User = require('../../models/User');

module.exports = {
    name: 'forcemarry',
    description: 'Forces marriage of two passerby',
    permissions: ['1506448680000159784'],
    category: 'admin',
    usage: '`stp forcemarry <member1> <member2> <ring>`',
    cooldown: 1000 * 60,
    testing: false,
    bypassDeath: true,
    alias: [],
    async execute(client, message, args) {
        const validRings = ['a', 'b', 'c', 'd', 'e'];
        if (!args[2]) return await message.reply(`Insufficient arguments: \`stp forcemarry <member1> <member2> <ring>\``);

        const uid1 = getIdFromMention(args[0]);
        const uid2 = getIdFromMention(args[1]);
        const ring = `ring${args[2].toUpperCase()}`;

        if (uid1 == null || uid2 == null) return await message.reply(`One of the members cannot be found.`);
        if (validRings.includes(ring)) return await message.reply(`Invalid ring. Choose between: \`${validRings.join(', ')}\``);

        const userData1 = await getUser(uid1);
        const userData2 = await getUser(uid2);

        const user1Married = userData1.marriage.uid.length > 0;
        const user2Married = userData2.marriage.uid.length > 0;

        if (user1Married || user2Married) return await message.reply(`One or both of the users are already married. They must divorce first.`)

        const date = Date.now();

        await User.findOneAndUpdate(
            { uid: uid1 },
            {
                marriage: {
                    uid: uid2,
                    date,
                    ring,
                    status: "Married"
                }
            }
        )

        await User.findOneAndUpdate(
            { uid: uid2 },
            {
                marriage: {
                    uid: uid1,
                    date,
                    ring,
                    status: "Married"
                }
            }
        )

        let xpBonusRings = ['ringB', 'ringE', 'ringF'];
        if (xpBonusRings.includes(ring)) {
            const targetMember = await message.guild.members.fetch(uid1);
            const ogUserMember = await message.guild.members.fetch(uid2);

            await targetMember.roles.add('1534551714328477767');
            await ogUserMember.roles.add('1534551714328477767');
        }

        await message.reply(`They have been married using ${iconizeItemWithName(ring)}`);
    }
}
const { getUser, getIdFromMention, iconizeItemWithName, addItemToInv } = require(`../../modules`);
const User = require('../../models/User');

module.exports = {
    name: 'forcedivorce',
    description: 'Forces the divorce of two married passersby',
    permissions: ['1506448680000159784'],
    category: 'admin',
    usage: '`stp forcedivorce <member1>`',
    cooldown: 1000 * 60,
    testing: false,
    bypassDeath: true,
    alias: [],
    async execute(client, message, args) {
        if (!args[0]) return await message.reply(`Insufficient arguments: \`stp forcedivorce <member1>\``);

        const uid1 = getIdFromMention(args[0]);

        if (uid1 == null) return await message.reply(`Member cannot be found.`);

        const userData1 = await getUser(uid1);
        const user1Married = userData1.marriage.uid.length > 0;
        if (!user1Married) return await message.reply(`They are not married.`);
        const uid2 = userData1.marriage.uid;
        const ring = userData1.marriage.ring;

        const changeToThis = {
            marriage: {
                uid: "",
                date: 0,
                ring: "",
                status: ""
            }
        }


        await User.findOneAndUpdate(
            { uid: uid1 },
            changeToThis
        )

        await User.findOneAndUpdate(
            { uid: uid2 },
            changeToThis
        )

        let xpBonusRings = ['ringB', 'ringE', 'ringF'];
        if (xpBonusRings.includes(ring)) {
            const targetMember = await message.guild.members.fetch(uid1);
            const ogUserMember = await message.guild.members.fetch(uid2);

            await targetMember.roles.remove('1534551714328477767');
            await ogUserMember.roles.remove('1534551714328477767');
        }

        await message.reply(`They have been divorced and their ${iconizeItemWithName(ring)} has been broken (effects removed, if any)`);
    }
}
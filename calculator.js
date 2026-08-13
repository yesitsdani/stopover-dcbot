const Perks = require("./models/Perks");
const { getUserPerks, createEmbedStandard, iconizeItemWithName, addItemToInv, getUser } = require("./modules");

module.exports = {
    matchType(enemyInfo, playerInfo) {
        return false;
    },
    nextLevel(level) {
        return 50 + (50 * parseInt(level));
    },
    async abundancePoint(uid, message) {
        const userPerks = await getUserPerks(uid);
        let abundancePoints = parseInt(userPerks.abundancePoints) + 1;

        if (abundancePoints >= 111) {
            abundancePoints = 0;
            await addItemToInv(uid, "abundanceGem", 1);
            const embed = createEmbedStandard()
                .setDescription(`# \`BEHOLD, THE GEM OF ABUNDANCE\`\nYou have mastered the overflow and harnessed the maximums of the material world. You received a ${iconizeItemWithName('abundanceGem')}`)
                .setThumbnail(message.author.avatarURL());
            await message.channel.send({ content: `<@${uid}>`, embeds: [embed] });
        }

        await Perks.findOneAndUpdate({ uid }, { abundancePoints });
    },
    async devotionPoint(uid, target, message) {
        const userPerks = await getUserPerks(uid);
        const userData = await getUser(uid);
        if (userData.marriage.uid == target) {
            let devotionPoints = parseInt(userPerks.devotionPoints) + 1;

            if (devotionPoints >= 43) {
                devotionPoints = 0;
                await addItemToInv(uid, "devotionGem", 1);
                const embed = createEmbedStandard()
                    .setDescription(`# \`BEHOLD, THE GEM OF DEVOTION\`\nYou have concentrated your affection towards a special someone. You received a ${iconizeItemWithName('devotionGem')}`)
                    .setThumbnail(message.author.avatarURL());
                await message.channel.send({ content: `<@${uid}>`, embeds: [embed] });
            }

            await Perks.findOneAndUpdate({ uid }, { devotionPoints });
        }
    }
}
const { getUserPerks, createEmbedStandard, checkIfNum, iconizeItemWithName, roleIconToId } = require("../../modules");

module.exports = {
    name: 'roleicon',
    description: 'Equips a role icon',
    category: 'utility',
    usage: '`stp roleicon [optional: role icon ID / clear]`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    permissions: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        const userPerks = await getUserPerks(uid);
        const iconsInInv = userPerks.rolePerks;

        const roleIcons = [ "1536749380332159016", "1536749687564927077", "1536750489600004107", "1536750981222768800", "1536751104317067367" ]

        if (!args[0]) {
            let content = `# \`YOUR ROLE ICONS\`:\n`;
            if (iconsInInv.length < 1) {
                content += `\nYou don't have role icons... Buy one in \`stp shop\``;
            } else {
                for (let i = 0; i < iconsInInv.length; i++) {
                    content += `\n\`ID: ${i+1}\` | ${iconizeItemWithName(roleIconToId(iconsInInv[i]))}`;
                }

                content += `\n\nEquip role icons using \`stp roleicon <id>\``;
            }
            const embed = createEmbedStandard()
            .setDescription(content)
            .setThumbnail(message.author.avatarURL());

            return message.reply({ embeds: [embed] });
        } else if (args[0].toLowerCase() == "clear") {
            await message.member.roles.remove(roleIcons);
            return await message.reply(`Your role icon have been removed. Use \`stp roleicon\` to equip one again`);
        } else {
            let roleIconId = checkIfNum(args[0]);
            if (roleIconId == null) return message.reply(`Please use \`stp roleicon <id or clear>\``);
            if (iconsInInv.length < 1) return message.reply(`You don't have role icons. Buy one in \`stp shop\``);
            const addingRole = iconsInInv[roleIconId - 1];
            if (!addingRole) return message.reply(`Invalid role icon ID. Check your role icons using \`stp roleicon\``);
            const removeRoles = roleIcons.filter(roles => roles != addingRole);
            await message.member.roles.add(addingRole);
            await message.member.roles.remove(removeRoles);

            return await message.reply(`Role icon equipped! (it should appear next to your name now)`);
        }
    }
}
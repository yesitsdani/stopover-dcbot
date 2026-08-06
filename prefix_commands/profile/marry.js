const ms = require("ms");
const { getUser, createEmbedStandard, iconizeItem, iconizeItemWithName, getItemDescriptionOnly } = require("../../modules");

module.exports = {
    name: 'marry',
    description: 'Checks marriage status',
    permissions: [],
    category: 'profile',
    usage: '`stp marry`',
    cooldown: 1000 * 60 * 5,
    testing: false,
    alias: ['marriage'],
    async execute(client, message, args) {
        const uid = message.author.id;
        const userData = await getUser(uid);

        if (userData.marriage.uid.length < 1) return message.reply(`You are currently not married.`);
        const partner = userData.marriage.uid;
        const status = userData.marriage.status;
        const since = userData.marriage.date;
        const ring = userData.marriage.ring;

        let content = `# ${iconizeItem(ring)} <@${partner}> <a:stp_heartspin:1523664759432548352>\n> \`SERVER-${status.toUpperCase()}\` since ${ms(Date.now() - parseInt(since), { long: true })} ago`;
        content += `\n\n${iconizeItemWithName(ring)} `;

        if (status.toLowerCase() == "married") {
            content += `(Active)`;
        } else {
            content += `(Inactive)`;
        }

        content += `\n${getItemDescriptionOnly(ring)}`;
        const member = await message.guild.members.fetch(partner);

        const embed = createEmbedStandard()
        .setThumbnail(member.user.avatarURL())
        .setDescription(content)

        await message.reply({ embeds: [embed] });
    }
}
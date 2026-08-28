const { getIdFromMention } = require("../../modules");

module.exports = {
    name: 'journalist',
    description: 'Hires or Fires a Server Journalist [Authorized Only]',
    category: 'council',
    usage: '`stp journalist <hire/fire> <Passerby>`',
    cooldown: 1000 * 5,
    testing: false,
    bypassDeath: true,
    alias: [],
    permissions: ['1506448680000159784', '1511897066262237285'],
    async execute(client, message, args) {
        if (!args[0]) return message.reply(`Please use \`stp journalist <hire/fire> <Passerby>\``);
        const validCategories = ['hire', 'fire'];
        let category = args.shift();
        category = category.toLowerCase();
        if (!validCategories.includes(category)) return message.reply(`Invalid \`<hire/fire>\` Please use between: \`${validCategories.join(`, `)}\``);

        const idRaw = args.shift();
        const uid = getIdFromMention(idRaw);
        if (uid == null) return message.reply(`Invalid channel`);

        const member = await message.guild.members.fetch(uid);

        if (!member) return message.reply(`Member not found`);
        if (member.user.bot) return message.reply(`That's a bot`);

        if (category == "hire") {
            await member.roles.add('1542899870908555404');

            return await message.reply(`\`HIRED!\` They are now a Passerby-Journalist!`);
        } else if (category == "fire") {
            await member.roles.remove('1542899870908555404');

            return await message.reply(`\`FIRED!\` They are no longer a Passerby-Journalist!`);
        }
    }
}
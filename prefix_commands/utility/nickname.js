
module.exports = {
    name: 'nickname',
    description: 'Sets Passerby nickname',
    category: 'utility',
    usage: '`stp nickname <nickname>`',
    cooldown: 1000 * 30,
    testing: false,
    alias: ['nn'],
    permissions: [],
    async execute(client, message, args) {
        if (!args[0]) return await message.reply(`Please use \`stp nickname <nickname>\``);

        let nick = args.join(" ");
        if (nick.length > 31) return message.reply(`Discord limits nicknames to a \`32\` character limit`);

        const member = message.member;

        try { 
            await member.setNickname(nick); 
            return await message.reply(`Nickname set!`);
        } catch (e) {
            return await message.reply(`Can't set your nickname. This is due to your \`ADMINISTRATOR\` permission`);
        }
    }
}
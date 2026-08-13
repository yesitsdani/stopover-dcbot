
module.exports = {
    name: 'choose',
    description: 'Helps you choose between certain things',
    category: 'utility',
    usage: '`stp choose <item1> | <item2> | <item3>... | <itemN>',
    cooldown: 1000 * 10,
    testing: false,
    alias: ['pick'],
    permissions: [],
    async execute(client, message, args) {
        if (!args[0]) return message.reply(`So what am I supposed to pick?`);
        let content = args.join(" ");
        let newArgs = content.split(" | ");

        if (!newArgs) return message.reply(`Please use delimiter \` | \``);
        if (newArgs.length < 2) return message.reply(`That's only one... Please use delimiter \` | \``);

        const selection = newArgs[Math.floor(Math.random() * newArgs.length)];
        return message.reply(`I pick: **${selection}**`);
    }
}
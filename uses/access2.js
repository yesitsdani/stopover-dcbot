module.exports = {
    name: "access2",
    description: "Gives access to the Deluxia Club Channel",
    async execute(client, message, args) {
        const uid = message.author.id;
        const deluxiaChannel = await message.guild.channels.fetch("1536747732688183376");
        deluxiaChannel.permissionOverwrites.edit(
            uid,
            {
                SendMessages: true
            }
        )

        await message.reply(`You have been given access to the <#1536747732688183376> (Pray and Gamble Commands Allowed!)`);
    }
}
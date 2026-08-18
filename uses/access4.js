const { iconizeMoney } = require("../modules");

module.exports = {
    name: "access4",
    description: "Gives access to the Casino Silver Channel",
    async execute(client, message, args) {
        const uid = message.author.id;
        const casinoChannel = await message.guild.channels.fetch("1539317293451055164");
        casinoChannel.permissionOverwrites.edit(
            uid,
            {
                SendMessages: true
            }
        )

        await message.reply(`You have been given access to the <#1539317293451055164> (Maximum bet limit raised to ${iconizeMoney(100000)})`);
    }
}
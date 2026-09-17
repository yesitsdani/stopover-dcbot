const { iconizeMoney } = require("../modules");

module.exports = {
    name: "access4",
    description: "Gives access to the Casino Silver Channel",
    async execute(client, message, args) {
        const uid = message.author.id;
        const casinoChannel = await message.guild.channels.fetch("1543499083853996104");
        casinoChannel.permissionOverwrites.edit(
            uid,
            {
                SendMessages: true
            }
        )

        await message.reply(`You have been given access to the <#1543499083853996104> (Maximum bet limit raised to ${iconizeMoney(1000000)})`);
    }
}
const { iconizeMoney } = require("../modules");

module.exports = {
    name: "access1",
    description: "Gives access to the Casino Bronze Channel",
    async execute(client, message, args) {
        const uid = message.author.id;
        const casinoChannel = await message.guild.channels.fetch("1536739822851596339");
        casinoChannel.permissionOverwrites.edit(
            uid,
            {
                SendMessages: true
            }
        )

        await message.reply(`You have been given access to the <#1536739822851596339> (Maximum bet limit raised to ${iconizeMoney(10000)})`);
    }
}
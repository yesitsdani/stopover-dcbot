const { snipes } = require("../../alerts");
const { createEmbedStandard } = require("../../modules")

module.exports = {
    name: 'snipe',
    description: 'Snipes the most current deleted message in a channel',
    category: 'utility',
    usage: '`stp snipe`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    permissions: [],
    async execute(client, message, args) {
        const snipe = snipes.get(message.channel.id);

        if (!snipe) return message.reply("There are no recently deleted messages to snipe (deleted messages only have 1 minute to be sniped)");

        if (snipe.authorId == "877167420572319804" && message.author.id != "877167420572319804") return message.reply(`I don't think I'm allowed to do that... to my creator`);

        const embed = createEmbedStandard()
            .setAuthor({
                name: snipe.authorName ?? "Unknown User",
                iconURL: snipe.authorAvatar ?? ""
            })
            .setDescription(snipe.content || "*No text content*")
            .setFooter({
                text: `${new Date(snipe.deletedAt).toLocaleString()} | the stopover bot by ashiii ♡`
            });

        if (snipe.attachments.length > 0) {
            embed.setImage(snipe.attachments[0]);
        }

        await message.channel.send({
            embeds: [embed]
        });
    }
}
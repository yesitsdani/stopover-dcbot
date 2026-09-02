const { snipes } = require("../alerts");


module.exports = {
    async run(client, message) {
        if (message.partial) return;
        if (!message.guild) return;
        if (message.author.bot) return;

        const snipeData = {
            content: message.content,
            authorId: message.author?.id,
            authorName: message.author?.username,
            authorAvatar: message.author?.avatarURL(),
            deletedAt: Date.now(),
            attachments: [...message.attachments.values()].map(att => att.url)
        }

        snipes.set(message.channel.id, snipeData);

        setTimeout(() => {
            if (snipes.get(message.channel.id) === snipeData) {
                snipes.delete(message.channel.id);
            }
        }, 1000 * 60);
    }
}
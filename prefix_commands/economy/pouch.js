const { getIdFromMention, getPouch, createEmbedStandard, getPouchCapacity, iconizeMoney, createLoadingScreen } = require("../../modules");

module.exports = {
    name: 'pouch',
    description: 'Shows pouch info',
    permissions: [],
    category: 'economy',
    usage: '`stp pouch <optional: passerby>`',
    cooldown: 1000 * 10,
    testing: false,
    bypassDeath: true,
    alias: [],
    async execute(client, message, args) {
        let uid = message.author.id;
        if (args[0] && getIdFromMention(args[0]) != null) uid = getIdFromMention(args[0]);

        let pronoun = "You";
        if (uid != message.author.id) pronoun = "They";

        const userPouch = await getPouch(uid);
        if (userPouch.level < 1) return message.reply(`${pronoun} don't have a magical gem pouch yet.`);

        let content = `### <@${uid}>'s Gem Pouch\n> A magical pouch that can carry gems, useful to protect gems from being lost upon death or stolen by other passersby.`
        content += `\n\n- Level: ${userPouch.level} | Capacity: ${iconizeMoney(getPouchCapacity(userPouch.level))}`;
        content += `\n#  Balance: ${iconizeMoney(userPouch.gems)}`;

        const embed = createEmbedStandard()
            .setDescription(content);

        const messageSent = await message.reply({ embeds: [createLoadingScreen()] });

        setTimeout(async () => {
            await messageSent.edit({ embeds: [embed] });
        }, 2000);
    }
}
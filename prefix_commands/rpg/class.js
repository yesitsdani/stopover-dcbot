const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { createEmbedStandard, getRpgUser } = require("../../modules");

module.exports = {
    name: 'class',
    description: 'Chooses your class',
    permissions: [],
    category: 'rpg',
    usage: '`stp class`',
    cooldown: 1000 * 60,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        const rpgData = await getRpgUser(uid);
        if (rpgData.class.length > 0) return message.reply(`You already belong to a class!`);

        let content = `# \`CHOOSE YOUR CLASS\`\n> This will be your role in your adventures!`

        content += `\n### :dagger: \`SWORDSMAN\`\n> Brave the world with a blade in hand! Your main damage is **melee**, great against physical enemies and wild animals. Not ideal for magical enemies though.\n> \`SWORDSMAN > WARRIOR > PALADIN > KNIGHT\``;
        content += `\n### :bow_and_arrow: \`ARCHER\`\n> Chase the wind with a bow and arrow! Your main damage is **range and speed**, great against flying and fast enemies. Not ideal for melee and physical enemies though.\n> \`ARCHER > HUNTER > SNIPER > RANGER\``;
        content += `\n### :magic_wand: \`MAGE\`\n> The earth is at your wand's command! Your main damage is **magic**, great against armored enermies and non-magical beings. Not ideal for fast-moving enemies though.\n> \`MAGE > HIGH MAGE > SAGE > SORCERER\``;
        content += `\n### :crystal_ball: \`CLERIC\`\n> No harm comes at the tip of your wand! You don't do much damage but you are the adventurers' greatest ally. You have the power to heal, remove curses, and bless adventurers in their journey.\n> \`CLERIC > HEALER > WHITE MAGE\``;

        content += `\n\n⚠️ Choose your class wisely! Changing classes in the future would reset your levels and skills back to the start!`;
        
        const embed = createEmbedStandard()
        .setDescription(content)
        .setThumbnail(message.author.avatarURL());
        const action = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId(`class.${uid}.newClass`)
            .setPlaceholder(`Choose your class here!`)
            .setMaxValues(1)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                .setLabel(`Swordsman`)
                .setDescription(`A blade is your friend.`)
                .setValue(`swordsman`),
                new StringSelectMenuOptionBuilder()
                .setLabel(`Archer`)
                .setDescription(`A bow and arrow comes in handy.`)
                .setValue(`archer`),
                new StringSelectMenuOptionBuilder()
                .setLabel(`Mage`)
                .setDescription(`A wand becomes an extension of your arm.`)
                .setValue(`mage`),
                new StringSelectMenuOptionBuilder()
                .setLabel(`Cleric`)
                .setDescription(`No harm must come to the world.`)
                .setValue(`cleric`)
            )
        )

        return message.reply({ embeds: [embed], components: [action] });
    }
}
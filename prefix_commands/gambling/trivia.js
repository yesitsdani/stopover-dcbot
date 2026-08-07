const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { checkIfNum, randomInt, getUser, canAfford, iconizeMoney, checkGemBoost, iconizeItem, addMoney, subtractMoney, createEmbedStandard, resetCommandCD } = require("../../modules");
const triviaQuestions = require('../../data/trivia.json');

module.exports = {
    name: 'trivia',
    description: 'Answer a trivia question',
    permissions: [],
    category: 'economy',
    usage: '`stp trivia`',
    cooldown: 1000 * 60 * 3,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        if (message.channel.id == '1506182833562193960') {
            await resetCommandCD(uid, module.exports.name);
            return message.reply(`'Wag naman sa simbahan beh...'`);
        }

        let questionChosen = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];

        let content = `### <a:spinheart:1534896467750420541> \`${questionChosen.question.toUpperCase()}\`\n> For ${iconizeMoney(questionChosen.reward)}\n\n**OPTIONS**:`

        const actions = new ActionRowBuilder()

        for (x of questionChosen.options) {
            content += `\n\`${x.label}\` | ${x.answer}`;
            actions.addComponents(
                new ButtonBuilder()
                    .setCustomId(`trivia.${uid}.${x.correct}.${questionChosen.reward}.${x.label}`)
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(x.label)
            )
        }

        content += `\n\n\`YOU HAVE 15 SECONDS TO ANSWER\``

        const embed = createEmbedStandard()
            .setDescription(content)
            .setThumbnail(message.author.avatarURL());

        const messageSent = await message.reply({ embeds: [embed], components: [actions] });

        setTimeout(async () => {
            if (messageSent.content.length < 1) await messageSent.edit({ content: `Times up! Be faster next time`, embeds: [], components: [] });
        }, 5000 * 3);
    }
}
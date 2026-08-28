const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { getGuildSettings, createEmbedStandard } = require("../../modules");


module.exports = {
    name: 'servernews',
    description: 'Writes, Edits, and Publishes Server News [Authorized Only]',
    category: 'council',
    usage: '`stp servernews`',
    cooldown: 1000 * 60 * 1,
    testing: false,
    bypassDeath: true,
    alias: [],
    permissions: ['1506448680000159784', '1511897066262237285', '1542899870908555404'],
    async execute(client, message, args) {
        const gid = message.guild.id;
        const guildData = await getGuildSettings(gid);
        const newsBuilder = guildData.newsBuilder;

        const embed = module.exports.createNewsEmbed(newsBuilder);
        const buttonRow = module.exports.createNewsButtons(newsBuilder);

        return message.reply({ embeds: [embed], components: [buttonRow] });
    },

    createNewsEmbed(newsBuilder) {
        const embed = createEmbedStandard();

        let content = `# `;

        if (newsBuilder.newsType.length > 0) {
            content += `\`${newsBuilder.newsType.toUpperCase()}\`\n`;
        } else {
            content += `\`NO NEWS SEGMENT YET\`\n> Select one by pressing \`SET SEGMENT\`\n`
        }

        if (newsBuilder.articles.length > 0) {
            for (article of newsBuilder.articles) {
                embed.addFields({
                    name: `${article.title.toUpperCase()}`,
                    value: `> ${article.content}`
                })
            }
        } else {
            content += `\n\`NO ARTICLES YET\` - Press the \`WRITE ARTICLE\` button below`;
        }

        if (newsBuilder.authors.length > 0) {
            let authorList = ``;
            for (author of newsBuilder.authors) {
                authorList += `<@${author}> `
            }
            embed.addFields({
                name: `Nag-uulat,`,
                value: `> ${authorList}`
            })
        } else {
            content += `\n\nNo Authors Yet`;
        }

        if (newsBuilder.imgURL.length > 0) {
            embed.setImage(newsBuilder.imgURL);
        }

        embed.setDescription(content);
        return embed;
    },

    createNewsButtons(newsBuilder) {
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Write Article`)
                    .setCustomId(`news.write`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setLabel(`Set Segment`)
                    .setCustomId(`news.setType`)
                    .setStyle(ButtonStyle.Secondary)
            )

        if (newsBuilder.articles.length > 0) {
            buttonRow.addComponents(
                new ButtonBuilder()
                    .setLabel(`Edit Articles`)
                    .setCustomId(`news.edit`)
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setLabel(`Delete Articles`)
                    .setCustomId(`news.del`)
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setLabel(`Publish`)
                    .setCustomId(`news.pub.primer`)
                    .setStyle(ButtonStyle.Success)
            )
        }

        return buttonRow;
    },

    createNewsArticleSelector(newsBuilder, action) {
        const menu = new StringSelectMenuBuilder()
            .setCustomId(`news.${action}`)
            .setPlaceholder(`Select Article`)
            .setMaxValues(1)

        const articles = newsBuilder.articles;

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            menu.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setValue(`${i}`)
                    .setDescription(`${article.title}`)
                    .setLabel(`Article #${i + 1}`)
            )
        }

        menu.addOptions(
            new StringSelectMenuOptionBuilder()
                .setValue(`cancel`)
                .setDescription(`Go back to the Server News Builder`)
                .setLabel(`Cancel and Go Back`)
        )

        const actions = new ActionRowBuilder()
            .addComponents(menu)

        return actions;
    }
}
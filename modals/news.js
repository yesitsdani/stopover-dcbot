const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { createEmbedStandard, getGuildSettings } = require("../modules");
const GuildSettings = require("../models/GuildSettings");
const { createNewsEmbed, createNewsButtons } = require("../prefix_commands/council/servernews");

module.exports = {
    name: "news",
    async execute(client, interaction, args) {
        const action = args.shift();

        await interaction.deferUpdate();
        const title = interaction.fields.getTextInputValue('title');
        const content = interaction.fields.getTextInputValue('content');
        const uid = interaction.user.id;

        const gid = interaction.guild.id;
        const guildData = await getGuildSettings(gid);
        let newsBuilder = guildData.newsBuilder;

        if (action == "newArticle") {
            let articles = newsBuilder.articles;

            articles.push({
                title, content
            });

            newsBuilder[`articles`] = articles;

            let authors = newsBuilder.authors;
            if (!authors.includes(uid)) authors.push(uid);

            newsBuilder[`authors`] = authors;

            const newGuildData = await GuildSettings.findOneAndUpdate(
                { gid },
                { newsBuilder },
                { returnDocument: 'after' }
            );

            const embed = createNewsEmbed(newGuildData.newsBuilder);
            const buttonRow = createNewsButtons(newGuildData.newsBuilder);

            return await interaction.editReply({ embeds: [embed], components: [buttonRow] });
        } else if (action == "editArticle") {
            const chosen = args.shift();
            const index = parseInt(chosen);

            let articles = newsBuilder.articles;
            articles[index] = { title, content };
            newsBuilder[`articles`] = articles;

            const newGuildData = await GuildSettings.findOneAndUpdate(
                { gid },
                { newsBuilder },
                { returnDocument: 'after' }
            );

            const embed = createNewsEmbed(newGuildData.newsBuilder);
            const buttonRow = createNewsButtons(newGuildData.newsBuilder);

            return await interaction.editReply({ embeds: [embed], components: [buttonRow] });
        }
    }
}
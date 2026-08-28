const { MessageFlags, LabelBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } = require("discord.js");
const { getGuildSettings } = require("../modules");
const { createNewsButtons, createNewsEmbed } = require("../prefix_commands/council/servernews");
const GuildSettings = require("../models/GuildSettings");

module.exports = {
    name: "news",
    async execute(client, interaction, args) {

        const uid = interaction.user.id;
        const member = await interaction.guild.members.fetch(uid);

        const allowedRoles = ['1506448680000159784', '1511897066262237285', '1542899870908555404']
        const hasPermission = allowedRoles.some((perm) => member.roles.cache.has(perm));
        if (!hasPermission) return await interaction.reply({ content: "You must be a Server Journalist to do this", flags: MessageFlags.Ephemeral });


        const action = args.shift();
        const chosen = interaction.values[0];

        const gid = interaction.guild.id;
        const guildData = await getGuildSettings(gid);
        let newsBuilder = guildData.newsBuilder;

        if (chosen == "cancel") {
            const buttonRow = createNewsButtons(newsBuilder);
            return await interaction.update({ components: [buttonRow] });
        }

        const articleIndex = parseInt(chosen);
        let targetArticle = newsBuilder.articles[articleIndex];

        if (action == "edit") {
            const modal = new ModalBuilder()
                .setCustomId(`news.editArticle.${articleIndex}`)
                .setTitle(`Stopover News`)
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(`Title of Article`)
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId(`title`)
                                .setStyle(TextInputStyle.Short)
                                .setValue(targetArticle.title)
                        )
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(`Content of Article`)
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId(`content`)
                                .setStyle(TextInputStyle.Paragraph)
                                .setValue(targetArticle.content)
                        )
                )

            return await interaction.showModal(modal);
        } else if (action == "del") {
            await interaction.deferUpdate();
            let articles = []
            for (let i = 0; i < newsBuilder.articles.length; i++) {
                if (i != articleIndex) articles.push(newsBuilder.articles[i]);
            }

            newsBuilder[`articles`] = articles;

            const newGuildData = await GuildSettings.findOneAndUpdate(
                { gid },
                { newsBuilder },
                { returnDocument: `after` }
            );

            const embed = createNewsEmbed(newGuildData.newsBuilder);
            const buttonRow = createNewsButtons(newGuildData.newsBuilder);

            return await interaction.editReply({ embeds: [embed], components: [buttonRow] });
        }


    }
}
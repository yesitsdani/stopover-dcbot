const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, LabelBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { getGuildSettings } = require("../modules");
const GuildSettings = require("../models/GuildSettings");
const { createNewsEmbed, createNewsButtons, createNewsArticleSelector } = require("../prefix_commands/council/servernews");


module.exports = {
    name: "news",
    async execute(client, interaction, args) {
        const uid = interaction.user.id;
        const member = await interaction.guild.members.fetch(uid);

        const allowedRoles = ['1506448680000159784', '1511897066262237285', '1542899870908555404']
        const hasPermission = allowedRoles.some((perm) => member.roles.cache.has(perm));
        if (!hasPermission) return await interaction.reply({ content: "You must be a Server Journalist to do this", flags: MessageFlags.Ephemeral });

        const gid = interaction.guild.id;
        const guildData = await getGuildSettings(gid);
        let newsBuilder = guildData.newsBuilder;
        const newsChannel = guildData.channels.news;

        const action = args.shift();

        if (action == "setType") {
            await interaction.deferUpdate();

            const buttonRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`Baklitanghali`)
                        .setCustomId(`news.type.baklitanghali`)
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setLabel(`Isang Baklita`)
                        .setCustomId(`news.type.isangbaklita`)
                        .setStyle(ButtonStyle.Success)
                )

            return await interaction.editReply({ components: [buttonRow] });

        } else if (action == "write") {
            if (newsBuilder.articles.length >= 10) return await interaction.reply({ content: "You can only have 10 articles at maximum", flags: MessageFlags.Ephemeral });
            const modal = new ModalBuilder()
                .setCustomId(`news.newArticle`)
                .setTitle(`Stopover News`)
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(`Title of Article`)
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId(`title`)
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder(`Write a catchy title`)
                        )
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(`Content of Article`)
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId(`content`)
                                .setStyle(TextInputStyle.Paragraph)
                                .setPlaceholder(`Write the article's content`)
                        )
                )

            return await interaction.showModal(modal);

        } else if (action == "type") {
            await interaction.deferUpdate();
            const option = args.shift();

            let newsType = "";
            let imgUrl = "";
            if (option == "baklitanghali") { newsType = "BAKLITANGHALI"; imgUrl = "https://imgur.com/XgLynUx.png"; }
            else if (option == "isangbaklita") { newsType = "ISANG BAKLITAAAA"; imgUrl = "https://imgur.com/p4ULRKx.png"; }

            newsBuilder[`newsType`] = newsType;
            newsBuilder[`imgURL`] = imgUrl;

            const newGuildData = await GuildSettings.findOneAndUpdate(
                { gid },
                { newsBuilder },
                { returnDocument: `after` }
            );

            const buttonRow = createNewsButtons(newGuildData.newsBuilder);
            const embed = createNewsEmbed(newGuildData.newsBuilder);
            return await interaction.editReply({ embeds: [embed], components: [buttonRow] });

        } else if (action == "edit") {
            await interaction.deferUpdate();

            const menuRow = createNewsArticleSelector(newsBuilder, 'edit');
            return await interaction.editReply({ components: [menuRow] });
        } else if (action == "del") {
            await interaction.deferUpdate();

            const menuRow = createNewsArticleSelector(newsBuilder, 'del');
            return await interaction.editReply({ components: [menuRow] });
        } else if (action == "pub") {
            await interaction.deferUpdate();

            const option = args.shift();

            let buttonRow = [];

            if (option == "primer") {
                const action = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Confirm Publication`)
                            .setCustomId(`news.pub.confirm`)
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setLabel(`Cancel and Go Back`)
                            .setCustomId(`news.pub.cancel`)
                            .setStyle(ButtonStyle.Danger)
                    )
                buttonRow.push(action);
            } else if (option == "confirm") {
                const channel = await interaction.guild.channels.fetch(newsChannel);
                const embed = createNewsEmbed(newsBuilder);

                await channel.send({ content: `# \`SERVER NEWS\`\n> \`ATTN\`: <@&1514158320821211246>`, embeds: [embed] });

                newsBuilder = {
                    newsType: "",
                    articles: [],
                    imgURL: "",
                    authors: []
                }

                await GuildSettings.findOneAndUpdate(
                    { gid },
                    { newsBuilder }
                )

                return await interaction.editReply({ content: `\`SUCCESS\` Sent to <#${newsChannel}> (News Builder has been cleared)`, embeds: [], components: [] });
            } else if (option == "cancel") {
                const buttons = createNewsButtons(newsBuilder);
                buttonRow.push(buttons);
            }

            return await interaction.editReply({ components: buttonRow })
        }
    }
}
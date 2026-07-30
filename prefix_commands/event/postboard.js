const { ContainerBuilder, MessageFlags, SectionBuilder, TextDisplayBuilder, TextInputBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder } = require('discord.js');

module.exports = {
    name: 'postboard',
    description: 'postboard',
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        if (!args[0]) return await message.reply(`Insufficient arguments: \`stp postboard <board>\``);

        const validBoards = ["maze", "teaparty", "redcastle", "magicforest", "lookingglass"]
        const board = args[0].toLowerCase();
        if (!validBoards.includes(board)) return await message.reply(`Invalid board. Please use: \`${validBoards.join(", ")}\``);
        const container = new ContainerBuilder();

        if (board == "maze") {
            container
                .setAccentColor(0x6BFFB0)
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`THE WONDERLAND MAZE\`\n> Welcome to Wonderland!\n\nNow, find a way out.`)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                        .addItems(
                            new MediaGalleryItemBuilder()
                                .setURL('https://imgur.com/wpLKL1x.png')
                        )
                )
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(`Ready for an adventure?`)
                        )
                        .setButtonAccessory(
                            new ButtonBuilder()
                                .setCustomId(`maze.s.0`)
                                .setLabel(`Enter Maze`)
                                .setStyle(ButtonStyle.Success)
                        )
                )
        } else if (board == "teaparty") {
            container
                .setAccentColor(0xB5EEFF)
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`THE HARE'S TEA PARTY\`\n> Outside the Red Castle, a smoking Hare standsby an unending tea party.\n\nThe Hare seems to have a drink to shrink and a cookie to be biggie. Rumors say if you ask nicely, he'll give you that cookie but for the drink... I'm not sure though.`)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                        .addItems(
                            new MediaGalleryItemBuilder()
                                .setURL('https://imgur.com/0T4Pl5O.png')
                        )
                )
                .addActionRowComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`hare.one`)
                                .setLabel(`Get Cookie`)
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId(`hare.two`)
                                .setLabel(`Get Drink`)
                                .setStyle(ButtonStyle.Primary)
                        )
                )
        } else if (board == "redcastle") {
            container
                .setAccentColor(0xFF205F)
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`THE QUEEN OF HEARTS\`\n> Inside the Red Castle is the great ruler of Wonderland, The Red Queen. \n\nShe seems to be having trouble with reaching her top and bottom shelves... if only someone short or tall can reach it for her.\n\nOh, and she has a looking glass: your one way ticket out of here.`)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                        .addItems(
                            new MediaGalleryItemBuilder()
                                .setURL('https://imgur.com/u3HFl2n.png')
                        )
                )
                .addActionRowComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`qoh.one`)
                                .setLabel(`Higher Shelf`)
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId(`qoh.two`)
                                .setLabel(`Lower Shelf`)
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId(`qoh.three`)
                                .setLabel(`Looking Glass`)
                                .setStyle(ButtonStyle.Primary)
                        )
                )
        } else if (board == "magicforest") {
            container
                .setAccentColor(0xCD8CFF)
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`THE MAGIC FOREST\`\n> They say someone unseen can be seen here.`)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                        .addItems(
                            new MediaGalleryItemBuilder()
                                .setURL('https://imgur.com/lzDj17V.png')
                        )
                )
                .addActionRowComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`cheshire.one`)
                                .setLabel(`Try Screaming`)
                                .setStyle(ButtonStyle.Primary)
                        )
                )
        } else if (board == "lookingglass") {
            container
                .setAccentColor(0xFFD334)
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`THE WAY OUT\`\n> If the rabbit's hole is clogged, only way out is through the looking glass\n\nA magical fog seems to block you from exiting though. Mirror mirror on the wall, say the words to free us all!`)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                        .addItems(
                            new MediaGalleryItemBuilder()
                                .setURL('https://imgur.com/ZEHotf0.png')
                        )
                )
                .addActionRowComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`finale.one`)
                                .setLabel(`Mirror, Mirror`)
                                .setStyle(ButtonStyle.Secondary)
                        )
                )
        }

        container.addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(`-# The Stopover | Escape Room 1: Stopover in Wonderland`)
        );

        return await message.channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
    }
}
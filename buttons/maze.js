const { MessageFlags, ContainerBuilder, TextDisplayBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } = require("discord.js")

const mazePoints = [
    {
        id: "0",
        text: "You found yourself in a maze... in front of you are two directions: left and forward.",
        options: [{ direction: "Left", toID: "maze.c.1" }, { direction: "Forward", toID: "maze.e" }]
    },
    {
        id: "1",
        text: "This is dizzying... in front of you are two directions: left and right.",
        options: [{ direction: "Left", toID: "maze.e" }, { direction: "Right", toID: "maze.c.2" }]
    },
    {
        id: "2",
        text: "Are we close to the end... in front of you are two directions: left and forward.",
        options: [{ direction: "Left", toID: "maze.c.3" }, { direction: "Forward", toID: "maze.c.5" }]
    },
    {
        id: "3",
        text: "It's kinda hot in wonderland... in front of you are two directions: left and right.",
        options: [{ direction: "Left", toID: "maze.c.6" }, { direction: "Right", toID: "maze.c.4" }]
    },
    {
        id: "4",
        text: "I think I see the end... in front of you are two directions: left and forward.",
        options: [{ direction: "Left", toID: "maze.c.7" }, { direction: "Forward", toID: "maze.w" }]
    },
    {
        id: "5",
        text: "This place is very whimsical... in front of you are two directions: forward and right.",
        options: [{ direction: "Forward", toID: "maze.e.1" }, { direction: "Right", toID: "maze.e.2" }]
    },
    {
        id: "6",
        text: "Maybe if I jump over these bushes... in front of you are two directions: left and forward.",
        options: [{ direction: "Left", toID: "maze.e" }, { direction: "Forward", toID: "maze.c.8" }]
    },
    {
        id: "7",
        text: "Wait, is this the right track... in front of you are two directions: forward and right.",
        options: [{ direction: "Forward", toID: "maze.e.1" }, { direction: "Right", toID: "maze.e.2" }]
    },
    {
        id: "8",
        text: "The doom is near... in front of you are two directions: left and right.",
        options: [{ direction: "Left", toID: "maze.e.1" }, { direction: "Right", toID: "maze.e.2" }]
    }
]

module.exports = {
    name: "maze",
    async execute(client, interaction, args) {
        const container = new ContainerBuilder()
            .setAccentColor(0x6BFFB0)
        if (args[0] == 's' || args[0] == 'c' || args[0] == 's1') {
            let mp = args[1];
            let cp = await mazePoints.find(pts => pts.id == `${mp}`);

            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# ${cp.text}`)
                )

            const row = new ActionRowBuilder();

            cp.options.forEach(dir => {
                row.addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(dir.toID)
                        .setLabel(`Go ${dir.direction}`)
                );
            });

            container.addActionRowComponents(row);

            if (args[0] == 's') return await interaction.reply({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
            if (args[0] == 'c' || args[0] == 's1') return await interaction.update({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
        } else if (args[0] == 'e') {
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`DEAD END\`\n> The magical maze transported you back to the entrance of the maze.\n\nReady to go again?`)
                )
                .addActionRowComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`maze.s1.0`)
                                .setLabel(`Try Again!`)
                                .setStyle(ButtonStyle.Success)
                        )
                )
            const stepchannel1 = interaction.guild.channels.cache.get(`1532654642947952770`);
            await stepchannel1.send(`**${interaction.user.username}** got stuck on a dead end and was magically transported back at the start of the maze!`);

            return await interaction.update({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
        } else if (args[0] == 'w') {
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`ESCAPE ROOM 1: STOPOVER IN WONDERLAND\`\n> You have crossed the magical maze and into the Castle of Red Hearts!\n\nWelcome to Wonderland, <@${interaction.user.id}>!`)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                        .addItems(
                            new MediaGalleryItemBuilder()
                                .setURL(`https://imgur.com/pZ8BMn0.png`)
                        )
                )

            const stepchannel2 = interaction.guild.channels.cache.get(`1532654642947952770`);
            await stepchannel2.send(`**${interaction.user.username}** got out of the maze!`);

            await interaction.update({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
            setTimeout(async () => {
                try {
                    const member = interaction.member;
                    await member.roles.add('1532389393162305546');
                    await member.roles.remove('1532389210827391066');
                } catch (e) {
                    console.log(`Can't add role: ${e}`)
                }
            }, 3000)
        }

    }
}
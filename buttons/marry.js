const { ContainerBuilder, TextDisplayBuilder, ActionRowBuilder, ModalBuilder, ButtonBuilder, ButtonStyle, MessageFlags, LabelBuilder, TextInputBuilder, TextInputStyle, MediaGalleryBuilder, MediaGalleryItemBuilder, SectionBuilder } = require("discord.js");
const { iconizeTitle, getUser, iconizeItem, takeItemFromInv } = require("../modules");
const User = require("../models/User");

module.exports = {
    name: "marry",
    async execute(client, interaction, args) {
        const action = args.shift();
        if (action == "respond") {
            const answer = args.shift();
            const target = args.shift();
            const uid = args.shift();
            const ring = args.shift();

            if (target != interaction.user.id) return await interaction.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });

            await interaction.deferUpdate();
            const container = new ContainerBuilder()
                .setAccentColor(0xffa0fb)

            if (answer == "yes") {
                container.addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`PROPOSAL ACCEPTED\`\n> Check the <#1506182833562193960>\n\nYou will need an officiator to activate the ring's effects.\nOfficiators can be a \`SERVER PRIEST\`, the \`ARCHBISHOP OF THE STOPOVER\`, or the ${iconizeTitle('the chief passerby')}\n\n-#  the stopover bot by ashiii ♡`)
                )

                const simbahan = await interaction.guild.channels.fetch(`1506182833562193960`);
                await simbahan.permissionOverwrites.edit(
                    interaction.guild.roles.everyone,
                    {
                        SendMessages: false
                    }
                )

                const targetData = await User.findOneAndUpdate(
                    { uid: target },
                    {
                        marriage: {
                            uid,
                            date: Date.now(),
                            ring,
                            status: "Fiance"
                        }
                    },
                    { returnDocument: 'after' }
                )

                const originalUserData = await User.findOneAndUpdate(
                    { uid },
                    {
                        marriage: {
                            uid: target,
                            date: Date.now(),
                            ring,
                            status: "Fiance"
                        }
                    },
                    { returnDocument: 'after' }
                )

                const unremoveableRing = ['ringF', 'ringG'];

                if (!unremoveableRing.includes(ring)) await takeItemFromInv(uid, ring, 1);

                const newContainer = new ContainerBuilder()
                    .setAccentColor(0xffa0fb)
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                        .setContent(`# \`A STOPOVER MARRIAGE\`\n> Ang simbahan pansamantalang nagsasara para sa server marriage ni <@${uid}> at <@${target}>\n\nAuthorized Passersby may officiate this wedding at any time.`)
                    )
                    .addSectionComponents(
                        new SectionBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent(`Can you officiate this marriage?`)
                            )
                            .setButtonAccessory(
                                new ButtonBuilder()
                                    .setCustomId(`marry.officiate.${target}.${uid}.${ring}`)
                                    .setLabel(`Officiate`)
                                    .setStyle(ButtonStyle.Primary)
                            )
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`-#  the stopover bot by ashiii ♡`)
                    )

                await simbahan.send({ components: [newContainer], flags: MessageFlags.IsComponentsV2 });
            } else {
                container.addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`PROPOSAL REJECTED\`\n> Better luck next time, <@${uid}>\n\n-#  the stopover bot by ashiii ♡`)
                )
            }

            return await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
        } if (action == "officiate") {
            const validTitles = ['server priest', 'archbishop of the stopover', 'the chief passerby'];
            const officiator = interaction.user.id;
            const officiatorData = await getUser(officiator);
            if (!validTitles.includes(officiatorData.title.toLowerCase())) return await interaction.reply({ content: `You must be a \`SERVER PRIEST\`, the \`ARCHBISHOP OF THE STOPOVER\`, or ${iconizeTitle('the chief passerby')} to officiate this wedding.`, flags: MessageFlags.Ephemeral });

            await interaction.deferUpdate();
            const target = args.shift();
            const uid = args.shift();
            const ring = args.shift();

            const targetData = await User.findOneAndUpdate(
                { uid: target },
                {
                    marriage: {
                        uid,
                        date: Date.now(),
                        ring,
                        status: "Married"
                    }
                },
                { returnDocument: 'after' }
            )

            const originalUserData = await User.findOneAndUpdate(
                { uid },
                {
                    marriage: {
                        uid: target,
                        date: Date.now(),
                        ring,
                        status: "Married"
                    }
                },
                { returnDocument: 'after' }
            )

            let content = `# \`SERVER MARRIED!\`\n> <@${target}> ${iconizeItem(ring)} <@${uid}>\n> Officiated by: <@${interaction.user.id}>\n\nGo forth, Passersby and enjoy the life of togetherness!\n> ${iconizeItem(ring)} Ring activated!`

            let xpBonusRings = ['ringB', 'ringE', 'ringF'];
            let gemBonusRings = ['ringC', 'ringE', 'ringF'];
            let dmgBonusRings = ['ringD', 'ringE', 'ringF'];
            if (xpBonusRings.includes(ring)) {
                const targetMember = await interaction.guild.members.fetch(target);
                const ogUserMember = await interaction.guild.members.fetch(uid);

                await targetMember.roles.add('1534551714328477767');
                await ogUserMember.roles.add('1534551714328477767');
                content += ` (XP Boost, check your roles)`;
            }
            if (gemBonusRings.includes(ring)) {
                content += ` (Gem Boost)`
            }
            if (dmgBonusRings.includes(ring)) {
                content += ` (DMG Boost)`
            }
            if (ring == "ringA") content += ` (No Additional Effects)`;

            const container = new ContainerBuilder()
                .setAccentColor(0xffa0fb)
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(content)
                )

            const simbahan = await interaction.guild.channels.fetch(`1506182833562193960`);
            await simbahan.permissionOverwrites.edit(
                interaction.guild.roles.everyone,
                {
                    SendMessages: null
                }
            )

            return await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
        }
    }
}
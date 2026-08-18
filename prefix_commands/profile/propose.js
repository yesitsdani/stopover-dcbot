const { getUser, getIdFromMention, getInv, hasItem, getItemNameOnly, getItemDescriptionOnly, iconizeItemWithName } = require(`../../modules`);
const User = require('../../models/User');
const { ContainerBuilder, TextDisplayBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageFlags, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'propose',
    description: 'Proposes to a Passerby (Requires Ring)',
    permissions: [],
    category: 'profile',
    usage: '`stp propose <member>`',
    cooldown: 1000 * 60 * 5,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        const userData = await getUser(uid);
        if (userData.marriage.uid.length > 0) return await message.reply(`You are currently married.`);

        if (!args[0]) return await message.reply(`Please use \`stp propose <member>\``);

        const target = getIdFromMention(args[0]);
        if (target == null) return await message.reply(`Member not found`);

        const targetData = await getUser(target);
        if (targetData.marriage.uid.length > 0) return await message.reply(`You're proposing to someone currently married`);

        if (target == uid) return await message.reply(`There, there... you'll find someone someday, beh`);

        const member = await message.guild.members.fetch(target);
        if (member.user.bot) return message.reply(`Sana okay ka lang...`);

        const invData = await getInv(uid);
        const validRings = ['ringA', 'ringB', 'ringC', 'ringD', 'ringE', 'ringF','ringG'];
        let ringsInInv = [];

        for (let i = 0; i < validRings.length; i++) {
            if (hasItem(invData.items, validRings[i], 1)) {
                ringsInInv.push(validRings[i]);
            }
        }

        if (!ringsInInv.includes('ringF') && uid == "877167420572319804") ringsInInv.push(`ringF`);

        const origMember = await message.guild.members.fetch(uid);
        if (origMember.roles.cache.has(`1511897066262237285`) && !ringsInInv.includes('ringG')) ringsInInv.push(`ringG`);

        if (ringsInInv.length < 1) return await message.reply(`You have no rings! Buy one in the \`stp shop\``);

        const container = new ContainerBuilder()
            .setAccentColor(0xffa0fb)

        if (ringsInInv.length > 1) {
            const ringSelection = new StringSelectMenuBuilder()
                .setCustomId(`marry.choosering.${uid}.${target}`)
                .setPlaceholder(`Choose between the rings you have`)

            for (x of ringsInInv) {
                ringSelection.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(getItemNameOnly(x))
                        .setDescription(getItemDescriptionOnly(x))
                        .setValue(x)
                )
            }

            ringSelection.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(`Cancel`)
                    .setDescription("Change your mind?")
                    .setValue("cancel")
            )

            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`CHOOSE A RING\`\n> Multiple rings in your inventory detected!`)
                )
                .addActionRowComponents(
                    new ActionRowBuilder()
                        .addComponents(ringSelection)
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`-# the stopover bot by ashiii ♡`)
                )

            return await message.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
        } else {
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`-# <@${target}>\n# \`SOMEONE IS PROPOSING TO YOU\`\n> Will you accept <@${uid}>'s server-marriage proposal?`)
                )
                .addActionRowComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`marry.respond.yes.${target}.${uid}.${ringsInInv[0]}`)
                                .setLabel(`Yes`)
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId(`marry.respond.no.${target}.${uid}.${ringsInInv[0]}`)
                                .setLabel(`No`)
                                .setStyle(ButtonStyle.Danger)
                        )
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`${iconizeItemWithName(ringsInInv[0])}\n\n-# the stopover bot by ashiii ♡`)
                )

            return await message.channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });

        }
    }
}
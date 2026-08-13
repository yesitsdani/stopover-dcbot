const { ActionRowBuilder, UserSelectMenuBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getMemberName, createEmbedStandard } = require("../modules");

module.exports = {
    name: "manage",
    async execute(client, interaction, args) {
        const uid = args.shift();
        if (uid != interaction.user.id) return interaction.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });
        const targetUid = args.shift();
        const action = args.shift();

        if (action == "other") {
            const actions = new ActionRowBuilder()
                .addComponents(
                    new UserSelectMenuBuilder()
                        .setCustomId(`manage.${uid}`)
                        .setPlaceholder(`Select a Passerby`)
                        .setMaxValues(1)
                        .setMinValues(1)
                )

            return await interaction.update({ components: [actions] });
        }

        if (action == "batch") {
            const actions = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`manage.${uid}.${targetUid}.batchSet.one`)
                    .setLabel(`1NDERFUL`)
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId(`manage.${uid}.${targetUid}.batchSet.two`)
                    .setLabel(`2ND2NONE`)
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId(`manage.${uid}.${targetUid}.batchSet.three`)
                    .setLabel(`3UPHORIA`)
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId(`manage.${uid}.${targetUid}.batchSet.four`)
                    .setLabel(`4TUNE`)
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId(`manage.${uid}.${targetUid}.batchSet.five`)
                    .setLabel(`5TAR`)
                    .setStyle(ButtonStyle.Secondary)
                )

            return await interaction.update({ components: [actions] });
        }

        await interaction.deferUpdate();

        const member = await interaction.guild.members.fetch(targetUid);
        const origMember = await interaction.guild.members.fetch(uid);

        let content = `### <@${targetUid}>'s `;

        if (action == "selfie") {
            if (member.roles.cache.has("1518254127006744696")) {
                await member.roles.remove("1518254127006744696");
                content += ` selfie access has been removed by ${getMemberName(origMember)} (<@${uid}>)`;
            } else {
                await member.roles.add("1518254127006744696");
                content += ` selfie access has been granted by ${getMemberName(origMember)} (<@${uid}>)`;
            }
        } else if (action == "nsfw") {
            if (member.roles.cache.has("1504338673900982272")) {
                await member.roles.remove("1504338673900982272");
                content += ` NSFW access has been removed by ${getMemberName(origMember)} (<@${uid}>)`;
            } else {
                await member.roles.add("1504338673900982272");
                content += ` NSFW access has been granted by ${getMemberName(origMember)} (<@${uid}>)`;
            }
        } else if (action == "batchSet") {
            let batchRoles = ['1513016636280541234', '1513016746326495286', '1515313966845267988', '1521884104738607104', '1523321069438636203'];
            let batchRoleToAdd = '';
            content += ` batch role has been set to`;
            const batchNumArg = args.shift();

            if (batchNumArg == "one") {
                content += ` \`1NDERFUL\``;
                batchRoles = batchRoles.filter(itm => itm != '1513016636280541234');
                batchRoleToAdd = "1513016636280541234";
            } else if (batchNumArg == "two") {
                content += ` \`2ND2NONE\``;
                batchRoles = batchRoles.filter(itm => itm != '1513016746326495286');
                batchRoleToAdd = "1513016746326495286";
            } else if (batchNumArg == "three") {
                content += ` \`3UPHORIA\``;
                batchRoles = batchRoles.filter(itm => itm != '1515313966845267988');
                batchRoleToAdd = "1515313966845267988";
            } else if (batchNumArg == "four") {
                content += ` \`4TUNE\``;
                batchRoles = batchRoles.filter(itm => itm != '1521884104738607104');
                batchRoleToAdd = "1521884104738607104";
            } else if (batchNumArg == "five") {
                content += ` \`5TAR\``;
                batchRoles = batchRoles.filter(itm => itm != '1523321069438636203');
                batchRoleToAdd = "1523321069438636203";
            }

            await member.roles.remove(batchRoles);
            await member.roles.add(batchRoleToAdd);
            content += `  by ${getMemberName(origMember)} (<@${uid}>)`;
        }

        const embed = createEmbedStandard()
        .setThumbnail(member.user.avatarURL())
        .setDescription(content)

        const modLogs = await interaction.guild.channels.fetch('1518574560033636412');
        await modLogs.send(content);

        await interaction.editReply({ embeds: [embed], components: [] })
    }
}
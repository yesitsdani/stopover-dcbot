const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { createEmbedStandard, getMemberName } = require(`../modules`);

module.exports = {
    name: "manage",
    async execute(client, interaction, args) {
        const uid = args.shift();
        if (interaction.user.id != uid) return interaction.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });

        if (!args[1]) {
            const user = interaction.users.first();
            const member = interaction.members.first();
            const targetUid = interaction.values[0];

            if (user.bot) return interaction.reply({ content: `This user is a bot`, flags: MessageFlags.Ephemeral });
            await interaction.deferUpdate();

            let content = `# <@${targetUid}>\n> Passerby Information\n\n`;

            if (member.roles.cache.has("1513016636280541234")) {
                content += `<@&1513016636280541234>`;
            } else if (member.roles.cache.has("1513016746326495286")) {
                content += `<@&1513016746326495286>`;
            } else if (member.roles.cache.has("1515313966845267988")) {
                content += `<@&1515313966845267988>`;
            } else if (member.roles.cache.has("1521884104738607104")) {
                content += `<@&1521884104738607104>`;
            } else if (member.roles.cache.has("1523321069438636203")) {
                content += `<@&1523321069438636203>`;
            } else {
                content += `\`NO BATCH ROLE!\``;
            }

            content += `\nHas Selfie Access: `;
            if (member.roles.cache.has("1518254127006744696")) {
                content += `\`YES\``;
            } else {
                content += `\`NO\``;
            }

            content += `\nHas NSFW Access: `;
            if (member.roles.cache.has("1504338673900982272")) {
                content += `\`YES\``;
            } else {
                content += `\`NO\``;
            }

            const embed = createEmbedStandard()
                .setThumbnail(user.avatarURL())
                .setDescription(content);

            const actions = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`manage.${uid}.${targetUid}.selfie`)
                        .setLabel(`Toggle Selfie Access`)
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(`manage.${uid}.${targetUid}.nsfw`)
                        .setLabel(`Toggle NSFW Access`)
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId(`manage.${uid}.${targetUid}.batch`)
                        .setLabel(`Change Batch`)
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`manage.${uid}.${targetUid}.other`)
                        .setLabel(`Other Passerby`)
                        .setStyle(ButtonStyle.Success)
                )

            await interaction.editReply({ embeds: [embed], components: [actions] });
        } else if (args[1] == "batchSet") {
            await interaction.deferUpdate();
            const targetUid = args.shift();

            const member = await interaction.guild.members.fetch(targetUid);
            const origMember = await interaction.guild.members.fetch(uid);

            let batchRoles = ['1513016636280541234', '1513016746326495286', '1515313966845267988', '1521884104738607104', '1523321069438636203', '1538537845302632548'];
            let batchRoleToAdd = interaction.values[0];
            let content = `<@${targetUid}>'s batch role has been set to <@&${batchRoleToAdd}>`;
            const batchNumArg = args.shift();
            batchRoles = batchRoles.filter(itm => itm != batchRoleToAdd);

            await member.roles.remove(batchRoles);

            await member.roles.add(batchRoleToAdd);
            content += `  by ${getMemberName(origMember)} (<@${uid}>)`;

            const embed = createEmbedStandard()
                .setDescription(content)

            const modLogs = await interaction.guild.channels.fetch('1518574560033636412');
            await modLogs.send({ embeds: [embed] });

            embed
                .setThumbnail(member.user.avatarURL())

            return await interaction.editReply({ embeds: [embed], components: [] });
        }

    }
}
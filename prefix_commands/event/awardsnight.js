const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Awards = require("../../models/Awards");
const { createEmbedStandard } = require("../../modules");

module.exports = {
    name: 'awardsnight',
    description: 'awardsnight',
    category: 'owner',
    usage: '`stp awardsnight <new; edit> <nominal>`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        const gid = message.guild.id;
        if (!args[0]) return message.reply(`Missing \`<new/edit>\``);
        const action = args.shift().toLowerCase();
        const validActions = ['new', 'edit'];
        if (!validActions.includes(action)) return message.reply(`Invalid action. Please use either \`new\` or \`edit\``);
        if (!args[0]) return message.reply(`Missing \`<nominal>\``);
        const nominal = args.shift().toLowerCase();
        const eventID = `${gid}-${nominal}`;

        const embed = createEmbedStandard();

        if (action == "new") {
            const trySee = await Awards.findOne({ eventID });
            if (trySee) return message.reply(`Nominal \`${nominal}\` already done. Use another one`);

            const newAwardsNight = await Awards.findOneAndUpdate(
                { eventID },
                {
                    $setOnInsert: {
                        eventID,
                        eventName: `${nominal} Stopover Awards`,
                        nominalToken: nominal,
                        awards: [],
                        congeniality: [],
                        logs: [],
                        eventFinished: false
                    }
                },
                {
                    upsert: true,
                    returnDocument: "after"
                }
            );

            embed
                .setThumbnail(message.guild.iconURL())
                .setDescription(`# \`${newAwardsNight.eventName.toUpperCase()}\`\n> New Awards Night Created!`);
        } else if (action == "edit") {
            const awardsNight = await Awards.findOne({ eventID });
            if (!awardsNight) return message.reply(`Could not find \`${nominal.toUpperCase()} STOPOVER AWARDS\`. To create, use: \`stp awardsnight new ${nominal}\``);

            let content = `# \`${awardsNight.eventName.toUpperCase()}\`\n### Awards:`;

            if (awardsNight.awards.length > 0) {
                let count = 1;
                for (x of awardsNight.awards) {
                    content += `\n${count}. ${x.award} | \`NOMINEES: ${x.nominees.length}\``;
                    count++;
                }
            } else {
                content += `\n *(No Awards Yet)*`;
            }

            embed
                .setThumbnail(message.guild.iconURL())
                .setDescription(content);
        }

        const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`awsn.nwaw.${eventID}`)
            .setLabel(`New Award`)
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId(`awsn.noms.${eventID}`)
            .setLabel(`Add Nominees`)
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId(`awsn.ov.${eventID}`)
            .setLabel(`Add Nominees`)
            .setStyle(ButtonStyle.Danger)
        )

        await message.channel.send({ embeds: [embed], components: [buttonRow] });
    }
}
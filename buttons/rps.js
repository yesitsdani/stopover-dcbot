const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { createEmbedStandard, getUser, checkGemBoost, iconizeMoney, iconizeItem, addMoney, subtractMoney } = require("../modules");
const { abundancePoint } = require("../calculator");

function iconizePlay(play) {
    if (play == 'r') return "🪨 `ROCK`";
    if (play == 'p') return "📄 `PAPER`";
    if (play == 's') return "✂️ `SCISSORS`";
}

module.exports = {
    name: "rps",
    async execute(client, interaction, args) {
        let uid = args.shift();
        if (uid != interaction.user.id) return await interaction.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });

        const action = args.shift();

        await interaction.deferUpdate();
        const embed = createEmbedStandard();
        const actions = new ActionRowBuilder();
        let components = [];

        if (action == "offer") {
            const response = args.shift();
            if (response == "reject") {
                embed.setDescription(`# \`REJECTED\`\n> <@${uid}> rejected a game of rock, paper, scissors`);
            } else if (response == "accept") {
                let target = uid;
                uid = args.shift();
                let betAmount = args.shift();
                betAmount = parseInt(betAmount);

                const member = await interaction.guild.members.fetch(target);

                embed
                    .setThumbnail(member.user.avatarURL())
                    .setDescription(`# \`GAME!\`\n> For <@${target}>!\n\nChoose between 🪨 \`ROCK\`, 📄 \`PAPER\`, or ✂️ \`SCISSORS\``);

                actions.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`rps.${target}.one.r.${uid}.${betAmount}`)
                        .setLabel(`🪨 Rock`)
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`rps.${target}.one.p.${uid}.${betAmount}`)
                        .setLabel(`📄 Paper`)
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`rps.${target}.one.s.${uid}.${betAmount}`)
                        .setLabel(`✂️ Scissors`)
                        .setStyle(ButtonStyle.Secondary)
                )
                components.push(actions);
            }
        } else if (action == "one") {
            const play = args.shift();
            let target = uid;
            uid = args.shift();
            let betAmount = args.shift();
            betAmount = parseInt(betAmount);

            const member = await interaction.guild.members.fetch(uid);

            embed
                .setThumbnail(member.user.avatarURL())
                .setDescription(`# \`GAME!\`\n> Your turn, <@${uid}>!\n\nChoose between 🪨 \`ROCK\`, 📄 \`PAPER\`, or ✂️ \`SCISSORS\``);

            actions.addComponents(
                new ButtonBuilder()
                    .setCustomId(`rps.${uid}.two.r.${target}.${betAmount}.${play}`)
                    .setLabel(`🪨 Rock`)
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`rps.${uid}.two.p.${target}.${betAmount}.${play}`)
                    .setLabel(`📄 Paper`)
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`rps.${uid}.two.s.${target}.${betAmount}.${play}`)
                    .setLabel(`✂️ Scissors`)
                    .setStyle(ButtonStyle.Secondary)
            )
            components.push(actions);
        } else if (action == "two") {
            let play = args.shift();
            let target = args.shift();
            let betAmount = args.shift();
            betAmount = parseInt(betAmount);
            let play2 = args.shift();
            const losingAmount = betAmount;

            let draw = false;
            if (play == play2) draw = true;

            let winningUid = '';
            let losingUid = '';
            let winningPlay = '';
            let losingPlay = '';

            if (!draw && play == 'r' && play2 == 's') {
                winningUid = uid;
                losingUid = target;
                winningPlay = play;
                losingPlay = play2;
            } else if (!draw && play == 'r' && play2 == 'p') {
                winningUid = target;
                losingUid = uid;
                winningPlay = play2;
                losingPlay = play;
            } else if (!draw && play == 'p' && play2 == 'r') {
                winningUid = uid;
                losingUid = target;
                winningPlay = play;
                losingPlay = play2;
            } else if (!draw && play == 'p' && play2 == 's') {
                winningUid = target;
                losingUid = uid;
                winningPlay = play2;
                losingPlay = play;
            } else if (!draw && play == 's' && play2 == 'p') {
                winningUid = uid;
                losingUid = target;
                winningPlay = play;
                losingPlay = play2;
            } else if (!draw && play == 's' && play2 == 'r') {
                winningUid = target;
                losingUid = uid;
                winningPlay = play2;
                losingPlay = play;
            }

            if (draw) {
                embed
                    .setDescription(`# \`DRAW\`!\n <@${uid}> and <@${target}> ended up in a draw in a game of rock paper scissors.\n\nThey both chose ${iconizePlay(play)} and lost nothing... they won nothing too though lol ;P`)
                    .setThumbnail(interaction.guild.iconURL())
            } else {
                const member = await interaction.guild.members.fetch(winningUid);
                const winnerData = await getUser(winningUid);
                const hasGemBoost = checkGemBoost(winnerData.marriage);

                let content = `# <@${winningUid}>\n> Won by choosing ${iconizePlay(winningPlay)}\n\nThey won ${iconizeMoney(betAmount)}`;

                if (hasGemBoost) {
                    let bonus = parseInt(betAmount * 0.25);
                    content += ` with additional ${iconizeMoney(bonus)} (${iconizeItem(winnerData.marriage.ring)} Ring Effect: 25% Gem Boost)`;
                    betAmount += bonus;
                }

                content += `\n\nOh, and <@${losingUid}> lost for picking ${iconizePlay(losingPlay)}. They lost ${iconizeMoney(losingAmount)}`;

                embed
                .setThumbnail(member.user.avatarURL())
                .setDescription(content);

                await addMoney(winningUid, betAmount);
                await subtractMoney(losingUid, losingAmount);

                await abundancePoint(winningUid, interaction.message);
            }
        }

        return await interaction.editReply({ content: `It's a game!`, embeds: [embed], components });
    }
}
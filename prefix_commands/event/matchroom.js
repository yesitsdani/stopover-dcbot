const { ChannelType, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { Match, getMatchData } = require("../../models/Match");
const { getGuildSettings, createEmbedStandard, getIdFromMention } = require("../../modules");
const { likingTimeGui } = require("../../buttons/mail");

let roomOwners = new Map();
let userRooms = new Map();
let matchroomPair = new Map();

module.exports = {
    name: 'matchroom',
    description: 'edits matchrooms',
    category: 'owner',
    usage: '`stp matchroom <option>`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        const validOptions = ['create', 'open', 'close', 'lock',
            'unlock', 'reset', 'setup', 'likingtime',
            'likingtimetest', 'reveal', 'revealtime', 'revealtimetest'];
        if (!args[0]) return message.reply(`Please indicate option between \`${validOptions.join(", ")}\``);
        const option = args[0].toLowerCase();
        if (!validOptions.includes(option)) return message.reply(`Please indicate option between \`${validOptions.join(", ")}\``);

        const gid = message.guild.id;
        const guildData = await getGuildSettings(gid);
        const msettings = guildData.MatchMakerSettings;

        if (option == "create") {
            roomOwners.clear();
            userRooms.clear();
            
            const matches = await Match.find();
            let count = 0;
            for (const match of matches) {
                count++;
                if (match.channel) {
                    roomOwners.set(match.channel, match.uid);
                    userRooms.set(match.uid, match.channel);
                    continue;
                };

                const channel = await message.guild.channels.create({
                    name: `┆💗┆|matchroom-${count + 1}`,
                    type: ChannelType.GuildText,
                    parent: "1525003791173288056",
                    permissionOverwrites: [
                        {
                            id: message.guild.roles.everyone.id,
                            deny: ['ViewChannel', 'SendMessages']
                        }
                    ]
                });

                roomOwners.set(channel.id, match.uid);
                userRooms.set(match.uid, channel.id);

                // Assign the channel ID
                match.channel = channel.id;
                await match.save();
            }

            return message.reply(`Created ${count} matchrooms`);
        } else if (option == "open") {
            await module.exports.openMatchrooms(message, msettings.matchIndex);
            return await message.reply(`Opened all Matchrooms!`);
        } else if (option == "close") {
            await module.exports.closeMatchrooms(message);
            return await message.reply(`Closed all Matchrooms!`);
        } else if (option == "lock") {
            await module.exports.lockMatchrooms(message);
            return await message.reply(`Locked all Matchrooms!`);
        } else if (option == "unlock") {
            await module.exports.unlockMatchrooms(message, msettings.matchIndex);
            return await message.reply(`Unlocked all Matchrooms!`);
        } else if (option == "setup") {
            matchroomPair.clear();

            const matches = await Match.find();
            for (const match of matches) {
                const currentPair = match.pairs[msettings.matchIndex];
                const channelID = userRooms.get(currentPair.uid);

                if (match.channel && channelID) {
                    matchroomPair.set(match.channel, channelID);
                }
            }
            matchroomPair.set(`matchnum`, `💌 \`MATCH #${msettings.matchIndex + 1}\``);
            return await message.reply(`Setup matchrooms!`)
        } else if (option == "reset") {
            const matches = await Match.find();
            let count = 0;
            for (const match of matches) {
                count++;
                if (match.channel) {
                    if (roomOwners.get(match.channel)) roomOwners.delete(match.channel);
                    if (userRooms.get(match.uid)) userRooms.delete(match.uid);
                    match.channel = null;
                    await match.save();
                }
            }
            return await message.reply(`Deleted ${count} matchrooms`);
        } else if (option == "likingtime") {
            return await module.exports.likingTime(message, msettings);
        } else if (option == "likingtimetest") {
            const uid = `877167420572319804`;
            const matchroom = await module.exports.findMatchroom(message.guild, userRooms.get(uid));
            return await matchroom.send(await likingTimeGui(uid, msettings));
        } else if (option == "reveal") {
            if (!args[1]) return message.reply(`Reveal who?`);
            const target = getIdFromMention(args[1]);
            if (!target || target == null) return message.reply(`Invalid mention`);
            const matchData = await getMatchData(target);
            if (!matchData) return message.reply(`That user is not a participant of the matchmaker event`);

            const embed = await module.exports.revealEmbed(target);
            return await message.reply({ embeds: [embed] });
        } else if (option == "revealtime") {
            return await module.exports.revealTime(message);
        } else if (option == "revealtimetest") {
            const uid = `877167420572319804`;
            let matchroom = await module.exports.findMatchroom(message.guild, userRooms.get(uid));
            return await matchroom.send(module.exports.revealTimeGui(uid));
        }

    },


    roomOwners,
    userRooms,
    matchroomPair,

    async openMatchrooms(message, matchIndex) {
        for (const [channelId, uid] of roomOwners) {
            const channel = await module.exports.findMatchroom(message.guild, channelId);
            if (!channel) continue;

            await channel.permissionOverwrites.edit(uid, {
                ViewChannel: true
            });
            await channel.send(`Hello <@${uid}>! This is your Anonymous Matchroom. You are currently paired with your 💌 \`MATCH #${matchIndex + 1}\`. Send a message here and it will be **anonymously** transmitted to your pairing's matchroom (Only texts)`)
        }
    },

    async closeMatchrooms(message) {
        for (const [channelId, uid] of roomOwners) {
            const channel = await module.exports.findMatchroom(message.guild, channelId);
            if (!channel) continue;

            await channel.permissionOverwrites.edit(uid, {
                ViewChannel: false
            });
        }
    },

    async lockMatchrooms(message) {
        for (const [channelId] of roomOwners) {
            const channel = await module.exports.findMatchroom(message.guild, channelId);
            if (!channel) continue;

            await channel.permissionOverwrites.edit(
                message.guild.roles.everyone.id,
                {
                    SendMessages: false
                });
        }
    },

    async unlockMatchrooms(message, matchIndex) {
        for (const [channelId, uid] of roomOwners) {
            const channel = await module.exports.findMatchroom(message.guild, channelId);
            if (!channel) continue;

            await channel.permissionOverwrites.edit(
                message.guild.roles.everyone.id,
                {
                    SendMessages: true
                });

            const matchData = await getMatchData(uid);
            const currentPair = matchData.pairs[matchIndex];
            const rating = currentPair.rating;

            await channel.send(`Hello <@${uid}>! You anonymous matchroom has opened! You are currently paired with: 💌 \`MATCH #${matchIndex + 1}\` and your similarity rating is:\n# <a:stp_heartspin:1523664759432548352> **\`${rating}\`**\nYou have 33 hours to chat, Passerby. Good luck and enjoy!`)
        }
    },

    async findMatchroom(guild, channelID) {
        let channel = guild.channels.cache.get(channelID);

        if (!channel) {
            try {
                channel = await guild.channels.fetch(channelID);
            } catch (error) {
                channel = false;
            }
        }

        return channel;
    },

    async likingTime(message, msettings) {
        for (const [channelId, uid] of roomOwners) {
            const channel = await module.exports.findMatchroom(message.guild, channelId);
            if (!channel) continue;

            await channel.permissionOverwrites.edit(
                message.guild.roles.everyone.id,
                {
                    SendMessages: false
                });

            await channel.send(await likingTimeGui(uid, msettings));
        }
    },

    async revealEmbed(uid) {
        const matchData = await getMatchData(uid);
        let content = `# <@${uid}>'s Matches\n> Day of Revelation\n`;

        let count = 1;
        let mutualMatches = 0;
        for (pairing of matchData.pairs) {
            content += `\n💌 \`MATCH #${count}\`: `;
            if (pairing.liked) {
                const pairData = await getMatchData(pairing.uid);
                const matchUp = pairData.pairs.find(itm => itm.uid == uid);
                if (matchUp.liked) {
                    content += `||<@${pairing.uid}>||`;
                    mutualMatches++;
                } else {
                    content += `Seems like they had other plans...`;
                }
            } else {
                content += `You chose not to meet them.`;
            }
            content += ` (${pairing.rating})\n`;
            count++;
        }

        if (mutualMatches > 0) content += `\nIt is now up to you, Passerby, if you should reach out or not. Hey, baka naghihintayan lamang kayo haha.`;
        else content += `\nThis edition's Matchmaker consisted of a limited pool of participants. Maybe today, the right match is not here yet for you. Maybe next time, Passerby?`;

        content += `\n\n**Thank you for joining 💌 \`THE STOPOVER MATCHMAKER: THE SHUFFLE OF LOVE\`** I hope you enjoyed this event and gave some Passersby a new light in your eyes.\n\nWith love,`;
        content += `\n# <:sig_ashi1:1528733933838012446><:sig_ashi2:1528734016704876554>\n-# 💌 \`THE STOPOVER MATCHMAKER\`\n-# <:stp_gavel:1528716403866341548> \`THE CHIEF PASSERBY\``;

        const embed = createEmbedStandard()
            .setDescription(content)

        return embed;
    },

    revealTimeGui(uid) {
        let content = `# \`THE DAY OF REVELATION\`\n> It's come to this, Passerby. Are you ready to know who your matches are?`;

        const embed = createEmbedStandard()
            .setDescription(content);

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`match.reveal`)
                    .setLabel(`Reveal Matches`)
                    .setStyle(ButtonStyle.Primary)
            )

        return { content: `<@${uid}>`, embeds: [embed], components: [buttonRow] };
    },

    async revealTime(message) {
        for (const [channelId, uid] of roomOwners) {
            const channel = await module.exports.findMatchroom(message.guild, channelId);
            if (!channel) continue;

            await channel.permissionOverwrites.edit(
                message.guild.roles.everyone.id,
                {
                    SendMessages: false
                });

            await channel.send(module.exports.revealTimeGui(uid));
        }
    }
}
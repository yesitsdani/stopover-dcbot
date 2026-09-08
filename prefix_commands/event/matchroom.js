const { ChannelType } = require("discord.js");
const { Match } = require("../../models/Match");
const { getGuildSettings } = require("../../modules");
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
        const validOptions = ['create', 'open', 'close', 'lock', 'unlock', 'reset', 'setup', 'likingtime', 'likingtimetest'];
        if (!args[0]) return message.reply(`Please indicate option between \`${validOptions.join(", ")}\``);
        const option = args[0].toLowerCase();
        if (!validOptions.includes(option)) return message.reply(`Please indicate option between \`${validOptions.join(", ")}\``);

        const gid = message.guild.id;
        const guildData = await getGuildSettings(gid);
        const msettings = guildData.MatchMakerSettings;

        if (option == "create") {
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
            await channel.send(`Hello <@${uid}>! You anonymous matchroom has opened! You are currently paired with: 💌 \`MATCH #${matchIndex + 1}\``)
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
    }
}
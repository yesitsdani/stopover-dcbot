const GuildSettings = require("./models/GuildSettings");
const { getGuildSettings } = require("./modules");

let afkUsers = [];
let mailedUsers = [];
let matchMails = [];
let snipes = new Map();

module.exports = {
    afkUsers,
    mailedUsers,
    snipes,
    matchMails,

    async newAfkUser(gid, afkUser) {
        afkUsers.push(afkUser);
        await GuildSettings.findOneAndUpdate(
            { gid },
            { afkUsers }
        );
        return afkUsers;
    },

    async removeAfkUser(gid, uid) {
        afkUsers = afkUsers.filter(itm => itm.uid != uid);
        await GuildSettings.findOneAndUpdate(
            { gid },
            { afkUsers }
        );
        return afkUsers;
    },

    getAfkUser(uid) {
        let afkUser = afkUsers.find(itm => itm.uid == uid);
        if (!afkUser) return false;
        return afkUser;
    },

    setAfkUsers(users) {
        afkUsers = users;
        return afkUsers;
    },

    async newMailedUser(gid, uid) {
        mailedUsers.push(uid);
        await GuildSettings.findOneAndUpdate(
            { gid },
            { mailedUsers }
        )
        return mailedUsers;
    },

    async removeMailedUser(gid, uid) {
        mailedUsers = mailedUsers.filter(itm => itm != uid);
        await GuildSettings.findOneAndUpdate(
            { gid },
            { mailedUsers }
        )
        return mailedUsers;
    },

    getMailedUser(uid) {
        if (mailedUsers.includes(uid)) return true;
        return false;
    },

    setMailedUsers(users) {
        mailedUsers = users;
        return mailedUsers;
    },

    async newMatchMail(gid, uid) {
        const guildData = await getGuildSettings(gid);
        let tempMatchMails = guildData.matchMails;
        if (!tempMatchMails.includes(uid)) {
            tempMatchMails.push(uid);

            await GuildSettings.findOneAndUpdate(
                { gid },
                { matchMails: tempMatchMails }
            );
        }
        return tempMatchMails;
    },

    async removeMatchMail(gid, uid) {
        matchMails = matchMails.filter(itm => itm != uid);
        await GuildSettings.findOneAndUpdate(
            { gid },
            { matchMails }
        )
        return mailedUsers;
    },

    getMatchMail(uid) {
        if (matchMails.includes(uid)) return true;
        return false;
    },

    setMatchMails(users) {
        matchMails = users;
        return mailedUsers;
    }
};
const GuildSettings = require("./models/GuildSettings");

let afkUsers = [];
let mailedUsers = [];
let snipes = new Map();

module.exports = {
    afkUsers,
    mailedUsers,
    snipes,

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
    }
};
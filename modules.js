const User = require('./models/User');
const Inv = require('./models/Inv')
const { EmbedBuilder } = require(`discord.js`);
const items = require(`./data/items.json`);

module.exports = {
    getIdFromMention(input) {
        if (!input) return null;

        // Already a Discord ID
        if (/^\d{17,20}$/.test(input)) {
            return input;
        }

        // User, role, or channel mention
        const match = input.match(/^<(?:@!?|@&|#)(\d+)>$/);

        return match ? match[1] : null;
    },
    async getUser(uid) {
        return await User.findOneAndUpdate(
            { uid },
            {
                $setOnInsert: {
                    uid,
                    title: "Passerby",
                    marriage: {
                        uid: "",
                        date: 0,
                        ring: "",
                        status: ""
                    },
                    bio: "",
                    money: 100,
                    codesRedeemed: [],
                    cooldowns: []
                }
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );
    },
    async addMoney(uid, amount) {
        let userData = await module.exports.getUser(uid);

        let money = userData.money;
        money += parseInt(amount);

        return await User.findOneAndUpdate(
            { uid },
            { money },
            { returnDocument: "after" }
        );
    },
    async subtractMoney(uid, amount) {
        let userData = await module.exports.getUser(uid);

        let money = userData.money;
        money -= parseInt(amount);

        return await User.findOneAndUpdate(
            { uid },
            { money },
            { returnDocument: "after" }
        );
    },
    async setMoney(uid, amount) {
        let userData = await module.exports.getUser(uid);

        let money = parseInt(amount);

        return await User.findOneAndUpdate(
            { uid },
            { money },
            { returnDocument: "after" }
        );
    },
    canAfford(userBalance, requiredAmount) {
        if (userBalance < requiredAmount) return false;
        return true;
    },
    createEmbedStandard() {
        return new EmbedBuilder()
            .setColor(0xffa0fb)
            .setFooter({ text: "the stopover bot by ashiii ♡" })
    },
    getMemberName(member) {
        if (member.nickname == null) {
            return member.user.displayName;
        } else {
            return member.nickname;
        }
    },
    async getInv(uid) {
        return await Inv.findOneAndUpdate(
            { uid },
            {
                $setOnInsert: {
                    items: [],
                    equipment: [],
                    health: 100,
                }
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );
    },
    async addItemToInv(uid, id, quantity) {
        let invData = await module.exports.getInv(uid);

        let items = invData.items;
        let itemInInv = items.find(itm => itm.id == id);
        items = items.filter(itm => itm.id != id);

        if (!itemInInv) {
            items.push({ id, quantity: parseInt(quantity) });
        } else {
            items.push({ id, quantity: parseInt(quantity) + parseInt(itemInInv.quantity) })
        }

        return await Inv.findOneAndUpdate(
            { uid },
            { items },
            { returnDocument: "after" }
        );
    },
    hasItem(userItems, id, requiredAmount) {
        let item = userItems.find(itm => itm.id == id);
        if (!item) return false;
        if (item.quantity < requiredAmount) return false;
        return true;
    },
    async takeItemFromInv(uid, id, quantity) {
        let invData = await module.exports.getInv(uid);

        let items = invData.items;
        let itemInInv = items.find(itm => itm.id == id);
        items = items.filter(itm => itm.id != id);

        if ((itemInInv.quantity - parseInt(quantity)) > 1) {
            items.push({
                id,
                quantity: parseInt(itemInInv.quantity) - parseInt(quantity)
            })
        }

        return await Inv.findOneAndUpdate(
            { uid },
            { items },
            { returnDocument: "after" }
        );
    },
    getItemNameOnly(itemID) {
        let item = items.find(itm => itm.id == itemID);
        if (!item) return false;
        return item.name;
    },
    getItemDescriptionOnly(itemID) {
        let item = items.find(itm => itm.id == itemID);
        if (!item) return false;
        return item.description;
    },
    iconizeItem(itemID) {
        const item = items.find(itm => itm.id == itemID);
        return `${item.icon}`;
    },
    iconizeItemWithName(itemID) {
        const item = items.find(itm => itm.id == itemID);
        return `${item.icon} \`${item.name}\``;
    },
    iconizeItemWithQuantity(itemID, quantity) {
        const item = items.find(itm => itm.id == itemID);
        return `${item.icon} \`${quantity}\``;
    },
    iconizeMoney(amount) {
        amount = parseInt(amount);
        return `<a:heartgem:1534217106252628038> \`${amount.toLocaleString("en-US")} gems\``
    },
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    iconizeTitle(title) {
        let content = '';
        if (title.toLowerCase() == "the chief passerby") {
            content += `<:gavel:1534097246675796009>`
        } else if (title.toLowerCase() == "member of the stopover council") {
            content += `<:council:1534102603040821308>`
        } else if (title.toLowerCase() == "first lady") {
            content += `<:stp_pinkbow:1534224205992955956>`
        } else {
            content += `<a:stp_pinkdiaheart:1532004326652772494>`
        }
        content += ` **\`${title.toUpperCase()}\`**`;
        return content;
    },
    checkIfNum(input) {
        const susNum = Number(input);
        if (Number.isNaN(susNum)) return false;
        return susNum;
    },
    checkGemBoost(marriage) {
        if (marriage.uid.length < 1) return false;
        if (marriage.status.toLowerCase() != 'married') return false;
        let validRings = ['ringC', 'ringE', 'ringF'];
        if (!validRings.includes(marriage.ring)) return false;
        return true;
    },
    async resetCommandCD(uid, cmdName) {
        const user = await module.exports.getUser(uid);
        let cooldowns = user.cooldowns;
        cooldowns = cooldowns.filter(item => item.cmd != cmdName);
        await User.findOneAndUpdate(
            { uid },
            { cooldowns }
        );
    }
}
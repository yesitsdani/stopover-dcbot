const { EmbedBuilder } = require(`discord.js`);
const User = require('./models/User');
const Inv = require('./models/Inv')
const Rpg = require('./models/Rpg');
const Perks = require(`./models/Perks`)
const items = require(`./data/items.json`);
const equipments = require(`./data/equipment.json`);
const recipes = require(`./data/recipes.json`);
const Pouch = require('./models/Pouch');

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
                    uid,
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

        if ((itemInInv.quantity - parseInt(quantity)) >= 1) {
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
        let content = `<a:heartgem:1534217106252628038> \`${amount.toLocaleString("en-US")} gem`;
        if (amount === 1) {
            content += `\``;
        } else {
            content += `s\``;
        }
        return content;
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
        } else if (title.toLowerCase() == "ang reyna ng stopover") {
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
        let validRings = ['ringC', 'ringE', 'ringF', 'ringG'];
        if (!validRings.includes(marriage.ring)) return false;
        return true;
    },
    getGemBoostBonus(marriage) {
        if (marriage.ring == `ringF`) return 0.45;
        else if (marriage.ring == `ringG`) return 0.35;
        else if (marriage.ring == `ringE` || marriage.ring == `ringC`) return 0.25;
        else return false;
    },
    async resetCommandCD(uid, cmdName) {
        const user = await module.exports.getUser(uid);
        let cooldowns = user.cooldowns;
        cooldowns = cooldowns.filter(item => item.cmd != cmdName);
        await User.findOneAndUpdate(
            { uid },
            { $set: { cooldowns } }
        );
    },
    async getRpgUser(uid) {
        return await Rpg.findOneAndUpdate(
            { uid },
            {
                $setOnInsert: {
                    uid,
                    class: "",
                    xp: 0,
                    level: 1,
                    area: 1,
                    health: 100,
                    maxHealth: 100,
                    dead: false,
                    weap: {
                        id: "",
                        enchantment: "",
                        cursed: false,
                    },
                    armor: {
                        id: "",
                        enchantment: ""
                    },
                    mainSkill: '',
                    skills: [],
                    blessed: false,
                    enemiesSlayed: [],
                    rune: {
                        id: '',
                        level: 0
                    },
                    tools: []
                }
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );
    },
    iconizeRpgClass(className) {
        if (className == null) return `:question: \`No Class Yet\` (Use \`stp class\`)`;
        const swordClasses = ['swordsman', 'warrior', 'paladin', 'knight'];
        if (swordClasses.includes(className.toLowerCase())) return `:dagger: \`${className.toUpperCase()}\``;
        const archerClasses = ['archer', 'hunter', 'sniper', 'ranger'];
        if (archerClasses.includes(className.toLowerCase())) return `:bow_and_arrow: \`${className.toUpperCase()}\``;
        const mageClasses = ['mage', 'high mage', 'sage', 'sorcerer'];
        if (mageClasses.includes(className.toLowerCase())) return `:magic_wand: \`${className.toUpperCase()}\``;
        const clericClasses = ['healer', 'cleric', 'white mage'];
        if (clericClasses.includes(className.toLowerCase())) return `:crystal_ball: \`${className.toUpperCase()}\``;
    },
    checkIfCleric(className) {
        if (['healer', 'cleric', 'white mage'].includes(className.toLowerCase())) return true;
        return false;
    },
    checkClassToWeapon(className, weaponID) {
        const weapon = equipments.find(weap => weap.id == weaponID);
        if (!weapon) return false;
        if (weapon.type == "armor") return false;
        const swordClasses = ['swordsman', 'warrior', 'paladin', 'knight'];
        if (swordClasses.includes(className.toLowerCase()) && weapon.type == "sword") return true;
        const archerClasses = ['archer', 'hunter', 'sniper', 'ranger'];
        if (archerClasses.includes(className.toLowerCase()) && weapon.type == "bow") return true;
        const mageClasses = ['mage', 'high mage', 'sage', 'sorcerer', 'healer', 'cleric', 'white mage'];
        if (mageClasses.includes(className.toLowerCase()) && weapon.type == "wand") return true;
        return false;
    },
    checkClassToDmgType(className) {
        const swordClasses = ['swordsman', 'warrior', 'paladin', 'knight'];
        if (swordClasses.includes(className.toLowerCase())) return "melee";
        const archerClasses = ['archer', 'hunter', 'sniper', 'ranger'];
        if (archerClasses.includes(className.toLowerCase())) return "range";
        const mageClasses = ['mage', 'high mage', 'sage', 'sorcerer', 'healer', 'cleric', 'white mage'];
        if (mageClasses.includes(className.toLowerCase())) return "magic";
    },
    checkIfArmor(equipmentID) {
        const armor = equipments.find(weap => weap.id == equipmentID);
        if (!armor) return false;
        if (armor.type != "armor") return false;
        return true;
    },
    checkIfTool(equipmentID) {
        const tool = equipments.find(weap => weap.id == equipmentID);
        if (!tool) return false;
        if (tool.type != "tool") return false;
        return true;
    },
    printValidWeapon(className) {
        const swordClasses = ['swordsman', 'warrior', 'paladin', 'knight'];
        if (swordClasses.includes(className.toLowerCase())) return `swords`;
        const archerClasses = ['archer', 'hunter', 'sniper', 'ranger'];
        if (archerClasses.includes(className.toLowerCase())) return `bows`;
        const mageClasses = ['mage', 'high mage', 'sage', 'sorcerer', 'healer', 'cleric', 'white mage'];
        if (mageClasses.includes(className.toLowerCase())) return `wands`;
    },
    canCraft(userItems, usableID, quantity) {
        const itemRecipe = recipes.find(rec => rec.craftingUsableId == usableID);
        let canCraft = true;
        const recipe = itemRecipe.recipe;
        let content = `You don't have enough items to craft this:`
        for (let i = 0; i < recipe.length; i++) {
            let item = userItems.find(itm => itm.id == recipe[i].id);
            let itemReference = items.find(itm => itm.id == recipe[i].id);
            if (!item) {
                canCraft = false;
                content += `\n${module.exports.iconizeItemWithName(itemReference.id)}: \`0\`/\`${recipe[i].quantity * quantity}\``;
            } else if (item && (item.quantity < (recipe[i].quantity * quantity))) {
                canCraft = false;
                content += `\n${module.exports.iconizeItemWithName(itemReference.id)}: \`${item.quantity}\`/\`${recipe[i].quantity * quantity}\``;
            }
        }

        if (canCraft) {
            return { canCraft, embeds: [] };
        } else {
            const embed = module.exports.createEmbedStandard()
                .setDescription(content);
            return { canCraft, embeds: [embed] };
        }
    },
    async getUserPerks(uid) {
        return await Perks.findOneAndUpdate(
            { uid },
            {
                $setOnInsert: {
                    uid,
                    cooldownDecrease: {
                        untilTime: 0,
                        multiplier: 1
                    },
                    rolePerks: [],
                    dmgBoost: [],
                    abundancePoints: 0,
                    devotionPoints: 0,
                    creationPoints: 0,
                    libertyPoints: 0
                }
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );
    },
    roleIconToId(roleId) {
        const roleIconDatas = [
            { roleID: "1536749380332159016", itemID: "roleIcon1" },
            { roleID: "1536749687564927077", itemID: "roleIcon2" },
            { roleID: "1536750489600004107", itemID: "roleIcon3" },
            { roleID: "1536750981222768800", itemID: "roleIcon4" },
            { roleID: "1536751104317067367", itemID: "roleIcon5" }
        ]

        const roleIconData = roleIconDatas.find(itm => itm.roleID == roleId);
        return roleIconData.itemID;
    },
    getBetLimit(channelID) {
        if (channelID == "1536748105276461077") return 250000;
        if (channelID == "1539317293451055164") return 100000;
        if (channelID == "1536739822851596339") return 10000;
        if (channelID == "1536747732688183376") return 7500;
        return 1000;
    },
    async rpgDeductHP(uid, amount) {
        const rpgData = await module.exports.getRpgUser(uid);

        let health = parseInt(rpgData.health) - parseInt(amount);
        let dead = false;
        let deadUntil = 0;
        if (health <= 0) {
            dead = true;
            deadUntil = Date.now() + (1000 * 60 * 5);
            health = 0;
        }

        return await Rpg.findOneAndUpdate(
            { uid },
            { health, dead, deadUntil },
            { returnDocument: "after" }
        )
    },
    async regenHP(uid, amount) {
        const rpgData = await module.exports.getRpgUser(uid);
        let health = rpgData.health + amount;
        if (health > rpgData.maxHealth) health = rpgData.maxHealth;
        const dead = false;
        const deadUntil = 0;
        return await Rpg.findOneAndUpdate(
            { uid },
            { health, dead, deadUntil },
            { returnDocument: "after" }
        );
    },
    async addMultipleItemsToInv(uid, arrayOfItems) {
        let invData = await module.exports.getInv(uid);

        let items = invData.items;

        for (x of arrayOfItems) {
            let id = x.id;
            let quantity = x.quantity;
            let itemInInv = items.find(itm => itm.id == id);
            items = items.filter(itm => itm.id != id);

            if (!itemInInv) {
                items.push({ id, quantity: parseInt(quantity) });
            } else {
                items.push({ id, quantity: parseInt(quantity) + parseInt(itemInInv.quantity) })
            }
        }

        return await Inv.findOneAndUpdate(
            { uid },
            { items },
            { returnDocument: "after" }
        );
    },
    async takeMultipleItemsFromInv(uid, arrayOfItems) {
        let invData = await module.exports.getInv(uid);

        let items = invData.items;

        for (x of arrayOfItems) {
            let id = x.id;
            let quantity = x.quantity;

            let itemInInv = items.find(itm => itm.id == id);
            items = items.filter(itm => itm.id != id);

            if ((itemInInv.quantity - parseInt(quantity)) >= 1) {
                items.push({
                    id,
                    quantity: parseInt(itemInInv.quantity) - parseInt(quantity)
                })
            }
        }

        return await Inv.findOneAndUpdate(
            { uid },
            { items },
            { returnDocument: "after" }
        );
    },
    async getPouch(uid) {
        return await Pouch.findOneAndUpdate(
            { uid },
            {
                $setOnInsert: {
                    uid,
                    level: 0,
                    gems: 0,
                    authorizedUsers: []
                }
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );
    },
    getPouchCapacity(level) {
        return level * 1000000;
    },
    getPouchUpgradeCost(level) {
        return parseInt((level * (level * 0.25)) * 100000);
    },
    async addToPouch(uid, amount) {
        const pouchData = await module.exports.getPouch(uid);
        const gems = pouchData.gems + parseInt(amount);
        return await Pouch.findOneAndUpdate(
            { uid },
            { gems },
            { returnDocument: "after" }
        )
    },
    async subtractFromPouch(uid, amount) {
        const pouchData = await module.exports.getPouch(uid);
        const gems = pouchData.gems - parseInt(amount);
        return await Pouch.findOneAndUpdate(
            { uid },
            { gems },
            { returnDocument: "after" }
        )
    },
    async setUserInBattle(uid, inBattle) {
        return await Rpg.findOneAndUpdate(
            { uid },
            { inBattle },
            { returnDocument: "after" }
        )
    },
    checkToolTypeInTools(tools, toolType) {
        let toolbox = [];
        for (x of tools) {
            toolbox.push(equipments.find(itm => itm.id == x.id));
        }
        toolbox = toolbox.filter(itm => itm.tooltype == toolType);
        if (toolbox.length > 0) return true;
        else return false;
    },
    removeToolTypeFromTools(tools, toolType) {
        let toolbox = [];
        for (x of tools) {
            let tool = equipments.find(itm => itm.id == x.id);
            if (tool.tooltype != toolType) toolbox.push({
                id: x.id,
                durability: x.durability
            })
        }
        return toolbox;
    },
    depleteTool(tools, toolType, amount) {
        let toolbox = [];
        for (x of tools) {
            let tool = equipments.find(itm => itm.id == x.id);
            if (tool.tooltype == toolType) {
                let newDurability = parseInt(x.durability) - parseInt(amount);
                if (newDurability > 0) toolbox.push({
                    id: x.id,
                    durability: newDurability
                });
            } else {
                toolbox.push({
                    id: x.id,
                    durability: x.durability
                })
            }
        }
        return toolbox;
    },
    getToolFromToolbox(tools, toolType) {
        let toolID = ``;
        for (x of tools) {
            let tool = equipments.find(itm => itm.id == x.id);
            if (tool.tooltype == toolType) toolID = x.id;
        }
        return toolID;
    },
    getChopPool(channelID) {
        return ['wood1','wood1','wood1','wood1','wood1','wood2','wood1','wood1'];
    },
    getMinePool(channelID) {
        return ['stone1','stone1','stone1'];
    }
}
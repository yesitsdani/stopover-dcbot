const Perks = require("./models/Perks");
const { getUserPerks, createEmbedStandard, iconizeItemWithName, addItemToInv, getUser, getRpgUser, rpgDeductHP, checkGemBoost, iconizeMoney, getGemBoostBonus, iconizeItem, randomInt, addMultipleItemsToInv, setUserInBattle, subtractMoney } = require("./modules");
const enemies = require(`./data/enemies.json`);
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const equipments = require('./data/equipment.json');
const Rpg = require("./models/Rpg");

module.exports = {
    matchType(enemyInfo, playerInfo) {
        return false;
    },
    nextLevel(level) {
        return 50 + (50 * parseInt(level));
    },
    async abundancePoint(uid, message) {
        const userPerks = await getUserPerks(uid);
        let abundancePoints = parseInt(userPerks.abundancePoints) + 1;

        if (abundancePoints >= 111) {
            abundancePoints = 0;
            await addItemToInv(uid, "abundanceGem", 1);
            const embed = createEmbedStandard()
                .setDescription(`# \`BEHOLD, THE GEM OF ABUNDANCE\`\nYou have mastered the overflow and harnessed the maximums of the material world. You received a ${iconizeItemWithName('abundanceGem')}`)
                .setThumbnail(message.author.avatarURL());
            await message.channel.send({ content: `<@${uid}>`, embeds: [embed] });
        }

        await Perks.findOneAndUpdate({ uid }, { abundancePoints });
    },
    async devotionPoint(uid, target, message) {
        const userPerks = await getUserPerks(uid);
        const userData = await getUser(uid);
        if (userData.marriage.uid == target) {
            let devotionPoints = parseInt(userPerks.devotionPoints) + 1;

            if (devotionPoints >= 43) {
                devotionPoints = 0;
                await addItemToInv(uid, "devotionGem", 1);
                const embed = createEmbedStandard()
                    .setDescription(`# \`BEHOLD, THE GEM OF DEVOTION\`\nYou have concentrated your affection towards a special someone. You received a ${iconizeItemWithName('devotionGem')}`)
                    .setThumbnail(message.author.avatarURL());
                await message.channel.send({ content: `<@${uid}>`, embeds: [embed] });
            }

            await Perks.findOneAndUpdate({ uid }, { devotionPoints });
        }
    },
    async creationPoint(uid, message, amount) {
        const userPerks = await getUserPerks(uid);
        let creationPoints = parseInt(userPerks.creationPoints) + parseInt(amount);

        if (creationPoints >= 111) {
            creationPoints = 0;
            await addItemToInv(uid, "creationGem", 1);
            const embed = createEmbedStandard()
                .setDescription(`# \`BEHOLD, THE GEM OF CREATION\`\nThe universe acknowledges the life you have created and sustained. You received a ${iconizeItemWithName('creationGem')}`)
                .setThumbnail(message.author.avatarURL());
            await message.channel.send({ content: `<@${uid}>`, embeds: [embed] });
        }

        await Perks.findOneAndUpdate({ uid }, { creationPoints });
    },
    async createEmbedFight(message, summonedEnemy, currentHp, deductToHP, uid, rpgData, deductToPlayer, turnCount) {
        let currentHP = parseInt(currentHp) - parseInt(deductToHP);
        let playerHP = rpgData.health;
        if (currentHP > 0) playerHP = await rpgDeductHP(uid, deductToPlayer);

        let content = ``;
        let actions = [];
        let isDead = false;

        if (playerHP.health == 0) {
            content += `# \`YOU DIED\`\n> Better luck next time!`;
            content += await module.exports.battleLost(message, uid);
            isDead = true;
            await setUserInBattle(uid, false);

        } else if (currentHP > 0) {
            content += `# ${summonedEnemy.icon} \`${summonedEnemy.name.toUpperCase()}\`\n> **ATK**: ${summonedEnemy.stat.atk} | **DEF**: ${summonedEnemy.stat.def}\n>`;
            if (summonedEnemy.type == "melee") content += ` :dagger:`;
            if (summonedEnemy.type == "magic") content += ` :magic_wand:`;
            if (summonedEnemy.type == "range") content += ` :bow_and_arrow:`;
            content += ` \`${summonedEnemy.rarity.toUpperCase()}\`\n`
            content += `\n🖤 \`Monster HP\`: ${currentHP} / ${summonedEnemy.hp}`;
            content += `\n❤️ \`Your HP\`: ${playerHP.health} / ${rpgData.maxHealth}`;
            if (turnCount > 0) content += `\n\n-# \`Turn: ${turnCount}\` You dealt **\`${deductToHP} DMG\`** to the ${summonedEnemy.name} but it also dealt **\`${deductToPlayer} DMG\`** to you...`

            turnCount = parseInt(turnCount);
            turnCount++;

            actions.push(new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`hunt.${uid}.atk.${summonedEnemy.id}.${currentHP}.${turnCount}`)
                        .setLabel(`Attack`)
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setCustomId(`hunt.${uid}.flee.${summonedEnemy.id}.${currentHP}.${turnCount}`)
                        .setLabel(`Flee`)
                        .setStyle(ButtonStyle.Danger)
                ))

        } else {
            content += `# ${summonedEnemy.icon} \`${summonedEnemy.name.toUpperCase()} DEFEATED\`\n> You dealt **\`${deductToHP} DMG\`** for your final blow\n\n`;
            content += await module.exports.battleWin(message, uid, summonedEnemy.id);
            await setUserInBattle(uid, false);
        }

        const embed = createEmbedStandard()
            .setDescription(content);


        return { gui: { embeds: [embed], components: actions }, isDead };
    },
    summonMonster(channelID) {
        let areaName = "zero";
        if (channelID == "1541814968200990731") areaName = "one";
        let areaObject = enemies.find(itm => itm.areaName == areaName);

        const roll = areaObject.rarities[Math.floor(Math.random() * areaObject.rarities.length)];
        const enemyPool = areaObject.monsters.filter(mons => mons.rarity == roll);
        const summonedEnemy = enemyPool[Math.floor(Math.random() * enemyPool.length)];

        return summonedEnemy;
    },
    calculateDMG(playerStat, enemyStat, type) {
        let damage = playerStat.atk * (1 + playerStat[`${type}Dmg`]);

        damage *= 100 / (100 + enemyStat.def);

        damage *= 1 - enemyStat[`${type}Res`];

        const critical = Math.random() < playerStat.critRate;

        if (critical) {
            damage *= 1 + playerStat.critDmg;
        }

        return {
            damage: Math.max(1, Math.round(damage)),
            critical
        }
    },
    createPlayerStat(rpgData) {

        let atk = 0
        let meleeDmg = 0;
        let magicDmg = 0;
        let rangeDmg = 0;
        let critRate = 0;
        let critDmg = 0;
        let def = 0;
        let meleeRes = 0;
        let magicRes = 0;
        let rangeRes = 0;

        const weapon = equipments.find(itm => itm.id == rpgData.weap.id);
        const armor = equipments.find(itm => itm.id == rpgData.armor.id);

        if (weapon) {
            atk += parseInt(weapon.atk);
            meleeDmg += weapon.dmg.melee
            magicDmg += weapon.dmg.magic
            rangeDmg += weapon.dmg.range
            critRate += weapon.crit.rate;
            critDmg += weapon.crit.dmg;
        }

        if (armor) {
            def += parseInt(armor.def);
            meleeRes += armor.res.melee;
            magicRes += armor.res.magic;
            rangeRes += armor.res.range;
            critRate += weapon.crit.rate;
            critDmg += weapon.crit.dmg;
        }

        let stat = {

            atk,
            meleeDmg,
            magicDmg,
            rangeDmg,
            critRate,
            critDmg,
            def,
            meleeRes,
            magicRes,
            rangeRes
        }

        const classBonus = module.exports.giveClassBonus(rpgData.class, rpgData.level);

        stat[`${classBonus.type}Dmg`] += classBonus.bonus;
        stat.critRate += classBonus.critRate;
        stat.critDmg += classBonus.critDmg;
        stat.atk += classBonus.atk;
        stat.def += classBonus.def;

        return stat;
    },
    createEnemyStat(monsterId) {

        const summonedEnemy = enemies.flatMap(area => area.monsters).find(monster => monster.id == parseInt(monsterId));

        return summonedEnemy.stat;
    },
    async battleWin(message, uid, monsterID) {
        const monster = enemies.flatMap(area => area.monsters).find(monster => monster.id == parseInt(monsterID));
        const rewards = monster.rewards;

        const userData = await getUser(uid);
        const gemBoostActive = checkGemBoost(userData.marriage);

        //Give gem rewards
        let amount = parseInt(rewards.money);
        let content = `You won ${iconizeMoney(amount)}!`
        if (gemBoostActive) {
            let bonus = parseInt(amount * getGemBoostBonus(userData.marriage));
            amount += bonus;
            content += ` You also get an additional ${iconizeMoney(bonus)} (${iconizeItem(userData.marriage.ring)} Ring Effect: +${getGemBoostBonus(userData.marriage) * 100}%)`;
        };

        //Give XP rewards
        let xpAmount = randomInt(rewards.xp.min, rewards.xp.max);
        const addXp = await module.exports.addXpToUser(uid, xpAmount);

        content += `\n\nYou also gained \`${xpAmount} EXP\`.`;

        if (addXp.levelUp) {
            content += ` **LEVEL UP!** You are now level ${addXp.newRpgData.level}`;
        }

        if (addXp.levelLock) {
            content += ` You have reached the maximum level for this class`;
        }

        //Get item rewards
        let arrayOfItems = [];
        content += `\n\nYou also gained:`

        for (x of rewards.items) {
            const quantity = randomInt(x.min, x.max);
            arrayOfItems.push({ id: x.id, quantity });
            content += `\n x${quantity} | ${iconizeItemWithName(x.id)}`;
        }

        await addMultipleItemsToInv(uid, arrayOfItems);

        return content;
    },
    async addXpToUser(uid, amount) {
        const rpgData = await getRpgUser(uid);

        let xp = rpgData.xp;
        let level = rpgData.level;
        let levelUp = false;
        if (level < 10) xp += parseInt(amount);

        let levelLock = false;
        const nextLevel = module.exports.nextLevel(rpgData.level);

        if (xp > nextLevel && level < 10) {
            xp = 0;
            level++;
            levelUp = true;
        } else if (level >= 10) {
            levelLock = true;
        }

        const newRpgData = await Rpg.findOneAndUpdate(
            { uid },
            { xp, level },
            { returnDocument: "after" }
        );

        return { newRpgData, levelUp, levelLock };
    },
    async battleLost(message, uid) {
        const rpgData = await getRpgUser(uid);

        let content = ``;

        const penalize = await module.exports.gemPenalty(uid, 0.5, 0.1);
        if (penalize.success) {
            await subtractMoney(uid, penalize.penalty);
            content += `\n\nUpon your death, you dropped ${iconizeMoney(penalize.penalty)}.`
        } else {
            content += `\n\nYou are fortunate for you did not drop any gems on your death`;
        }
        content += ` You can \`stp revive\` in 5 minutes or be revived by a cleric via \`stp heal\`.`;
        return content;
    },
    calculateBaseAtkDef(level) {

    },
    async gemPenalty(uid, successRate, upTo) {
        const userData = await getUser(uid);
        const balance = userData.money;
        const maxAmount = balance * upTo;
        const success = Math.random() < successRate;
        let penalty = 0;
        if (success) {
            penalty += parseInt(maxAmount * Math.random());
        }
        return {
            success, penalty
        }
    },
    async addToEnemiesSlain(uid, enemyID, turnCount) {
        let content = '';
        const id = parseInt(enemyID);
        const turns = parseInt(turnCount);

        const rpgData = await getRpgUser(uid);
        let enemiesSlayed = rpgData.enemiesSlayed;
        const enemyInArray = enemiesSlayed.find(itm => itm.id == id);
        if (!enemyInArray) {
            enemiesSlayed.push({ id, turns });
            await Rpg.findOneAndUpdate(
                { uid },
                { enemiesSlayed }
            )
            content += `\n\n-# You can now slay this enemy in \`stp autohunt\`. Fair warning: you will take damage based on the number of turns: \`${turns} TURNS\``;
        } else if (enemyInArray.turns > turns) {
            enemiesSlayed = enemiesSlayed.filter(itm => itm.id != id);
            enemiesSlayed.push({ id, turns });
            await Rpg.findOneAndUpdate(
                { uid },
                { enemiesSlayed }
            )
            content += `\n\n-# New record: \`${turns} TURNS\`! You can slay this enemy for lesser turns in \`stp autohunt\``;
        }

        return content;
    },
    giveClassBonus(className, level) {
        let type = ``;
        let bonus = (0.05) * level;
        let critDmg = 0;
        let critRate = 0;
        let atk = (4) * level;
        let def = (4) * level;

        const swordClasses = ['swordsman', 'warrior', 'paladin', 'knight'];
        if (swordClasses.includes(className.toLowerCase())) {
            type = "melee";
            critDmg = 0.1 * level;
        }
        const archerClasses = ['archer', 'hunter', 'sniper', 'ranger'];
        if (archerClasses.includes(className.toLowerCase())) {
            type = "range";
            critRate = 0.045 * level;
            def = 2 * level;
        }
        const mageClasses = ['mage', 'high mage', 'sage', 'sorcerer'];
        if (mageClasses.includes(className.toLowerCase())) {
            type = "magic";
            bonus = (0.07) * level;
            atk = (7) * level;
        }
        const clericClasses = ['healer', 'cleric', 'white mage'];
        if (clericClasses.includes(className.toLowerCase())) {
            type = "magic";
            bonus = (0.03) * level;
            atk = (2) * level;
        }

        return {
            type, bonus, critRate, critDmg, atk, def
        }
    },
    getMonster(id) {
        return enemies.flatMap(area => area.monsters).find(monster => monster.id == parseInt(id));
    },
    levelHealth(level) {
        return 95 + (5 * level);
    },
    async setHealth (uid, newMaxHealth) {
        const maxHealth = parseInt(newMaxHealth);
        return await Rpg.findOneAndUpdate(
            { uid },
            { maxHealth },
            { returnDocument: `after` }
        )
    }
}
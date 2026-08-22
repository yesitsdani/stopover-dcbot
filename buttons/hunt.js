const { createPlayerStat, createEnemyStat, createEmbedFight, calculateDMG } = require('../calculator');
const enemies = require('../data/enemies.json');
const { getRpgUser, checkClassToDmgType, setUserInBattle } = require('../modules');

module.exports = {
    name: "hunt",
    async execute(client, interaction, args) {
        const uid = args.shift();
        if (uid != interaction.user.id) return interaction.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });

        const action = args.shift();
        const enemyID = args.shift();
        let currentHP = args.shift();
        let turnCount = args.shift();
        turnCount = parseInt(turnCount);

        const summonedEnemy = enemies.flatMap(area => area.monsters).find(monster => monster.id == parseInt(enemyID));
        const rpgData = await getRpgUser(uid);

        if (action == "atk") {
            await interaction.deferUpdate();
            await setUserInBattle(uid, true);
            const type = checkClassToDmgType(rpgData.class);
            const playerAtk = calculateDMG(
                createPlayerStat(rpgData),
                createEnemyStat(enemyID),
                type
            )

            const playerHurt = calculateDMG(
                createEnemyStat(enemyID),
                createPlayerStat(rpgData),
                summonedEnemy.type
            )
            const embed = await createEmbedFight(interaction.message, summonedEnemy, currentHP, playerAtk.damage, uid, rpgData, playerHurt.damage, turnCount);

            await interaction.editReply(embed.gui);
            if (embed.isDead) {
                setTimeout(async () => {
                    const member = await interaction.guild.members.fetch(uid);
                    await member.roles.add(`1540634777194070016`);
                }, 2000);
            }
            return;
        } else {
            return await interaction.update({ components: [], content: "Fleed" });
        }
    }
}
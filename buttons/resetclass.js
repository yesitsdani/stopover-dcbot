const { MessageFlags } = require("discord.js");
const { createEmbedStandard, getRpgUser, addItemToInv, getUser, subtractMoney, canAfford, iconizeMoney } = require("../modules");
const Rpg = require("../models/Rpg");

module.exports = {
    name: "resetclass",
    async execute(client, interaction, args) {
        const uid = args.shift();
        if (uid != interaction.user.id) return message.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });

        await interaction.deferUpdate();

        let content = ``;

        const action = args.shift();

        if (action == "confirm") {
            const userData = await getUser(uid);
            if (!canAfford(userData.money, 5000)) return await interaction.editReply({ embeds: [], components: [], content: `You don't have enough money for this. You need ${iconizeMoney(5000)}` });

            const rpgData = await getRpgUser(uid);
            const addWeapon = rpgData.weap.id;
            const addArmor = rpgData.armor.id;
            await Rpg.findOneAndUpdate(
                { uid },
                {
                    class: "",
                    level: 1,
                    xp: 0,
                    weap: {
                        id: "",
                        enchantment: "",
                        cursed: false
                    },
                    armor: {
                        id: "",
                        enchantment: ""
                    }
                }
            )
            if (addWeapon.length > 0) await addItemToInv(uid, addWeapon, 1);
            if (addArmor.length > 0) await addItemToInv(uid, addArmor, 1);
            await subtractMoney(uid, 5000);

            content += `# \`CLASS RESET\`\n> You have chosen to reset your class.\n\nYour Level and XP have been reset, your armor and sword have been unequipped (check inventory), and you have been fined ${iconizeMoney(5000)}`;
        } else if (action == "cancel") {
            content += `# \`OPERATION CANCELLED\`\n> You chose to keep your current class`;
        }

        const embed = createEmbedStandard()
            .setDescription(content)
            .setThumbnail(interaction.user.avatarURL());

        return await interaction.editReply({ content: `Done!`, components: [], embeds: [embed] });
    }
}
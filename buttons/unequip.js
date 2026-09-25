const { MessageFlags } = require("discord.js");
const { createEmbedStandard, getRpgUser, addItemToInv, removeToolTypeFromTools } = require("../modules");
const Rpg = require("../models/Rpg");

module.exports = {
    name: "unequip",
    async execute(client, interaction, args) {
        const uid = args.shift();
        if (uid != interaction.user.id) return message.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });

        await interaction.deferUpdate();
        const action = args.shift();

        if (action == "cancel") {
            return await interaction.editReply({ components: [], content: `Cancelled.` });
        }

        const rpgData = await getRpgUser(uid);
        let unequipThis;
        let addThis;

        if (action == "weapon") {
            unequipThis = {
                weap: {
                    id: "",
                    enchantment: "",
                    cursed: false
                }
            }
            addThis = rpgData.weap.id;
        } else if (action == "armor") {
            unequipThis = {
                armor: {
                    id: "",
                    enchantment: ""
                }
            }
            addThis = rpgData.armor.id;
        } else if (action == "pickaxe") {
            const tools = removeToolTypeFromTools(rpgData.tools, 'pickaxe');
            unequipThis = { tools };
            addThis = false;
        } else if (action == "axe") {
            const tools = removeToolTypeFromTools(rpgData.tools, 'axe');
            unequipThis = { tools };
            addThis = false;
        }

        if (unequipThis) await Rpg.findOneAndUpdate(
            { uid },
            unequipThis
        )

        if (addThis) await addItemToInv(uid, addThis, 1);

        const embed = createEmbedStandard()
        .setDescription(`# \`UNEQUIPPED ${action.toUpperCase()}\``)
        .setThumbnail(interaction.user.avatarURL())

        return await interaction.editReply({ components: [], embeds: [embed] });
    }
}
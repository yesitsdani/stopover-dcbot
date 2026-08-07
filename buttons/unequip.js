const { MessageFlags } = require("discord.js");
const { createEmbedStandard, getRpgUser, addItemToInv } = require("../modules");
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
        }

        await Rpg.findOneAndUpdate(
            { uid },
            unequipThis
        )

        await addItemToInv(uid, addThis, 1);

        const embed = createEmbedStandard()
        .setDescription(`# \`UNEQUIPPED ${action.toUpperCase()}\`\n> The unequipped ${action} is now in your inventory.`)
        .setThumbnail(interaction.user.avatarURL())

        return await interaction.editReply({ components: [], embeds: [embed] });
    }
}
const Pouch = require("../models/Pouch");
const { addItemToInv, getPouch, getPouchUpgradeCost, subtractMoney, canAfford, getUser, createEmbedStandard, iconizeMoney, getPouchCapacity } = require("../modules");

module.exports = {
    name: "pouch",
    async execute(client, interaction, args) {
        const uid = args.shift();
        if (uid != interaction.user.id) return interaction.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });

        const action = args.shift();

        if (action == "cancel") {
            await interaction.deferUpdate();
            await addItemToInv(uid, 'magical_pouch', 1);
            await interaction.editReply({ content: `Operation cancelled.`, components: [] });
        } else if (action == "upgrade") {
            await interaction.deferUpdate();

            const pouchData = await getPouch(uid);
            const userData = await getUser(uid);
            const level = parseInt(pouchData.level + 1);
            const cost = getPouchUpgradeCost(level);

            const afford = await canAfford(userData.money, cost);
            if (!afford) {
                await addItemToInv(uid, 'magical_pouch', 1);
                return await interaction.editReply({ embeds: [], components: [], content: `You need ${iconizeMoney(cost)} to do this. Operation cancelled.` });
            }

            await subtractMoney(uid, cost);
            const newPouch = await Pouch.findOneAndUpdate(
                { uid },
                { level },
                { returnDocument: "after" }
            );

            let content = `# \`SUCCESS!\``;
            if (level == 1) {
                content += `\n> You have a new Magical Gem Pouch!\n\nGem Capacity: ${iconizeMoney(getPouchCapacity(level))}`;
            } else {
                content += `\n> You have upgraded your Magical Gem Pouch!\n\n**NEW** Gem Capacity: ${iconizeMoney(getPouchCapacity(level))}`;
            }

            const embed = createEmbedStandard()
            .setDescription(content)
            .setThumbnail(interaction.user.avatarURL())

            return await interaction.editReply({ content: `Success!`, embeds: [embed], components: [] });
        }
    }
}
const { MessageFlags } = require("discord.js");
const { createEmbedStandard, getRpgUser, addItemToInv, getUser } = require("../modules");
const User = require("../models/User");

module.exports = {
    name: "divorce",
    async execute(client, interaction, args) {
        const uid = args.shift();
        if (uid != interaction.user.id) return message.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });

        await interaction.deferUpdate();
        const action = args.shift();

        if (action == "cancel") {
            return await interaction.editReply({ embeds: [], components: [], content: `Divorce cancelled.` });
        }

        const userData = await getUser(uid);
        const partnerUid = userData.marriage.uid;

        const changeToThis = {
            marriage: {
                uid: "",
                date: 0,
                ring: "",
                status: ""
            }
        }

        await User.findOneAndUpdate(
            { uid },
            changeToThis
        )

        await User.findOneAndUpdate(
            { uid: partnerUid },
            changeToThis
        )


        const embed = createEmbedStandard()
            .setDescription(`# \`DIVORCED\`\n> You have decided to divorce. Rings have been broken.`)
            .setThumbnail(interaction.user.avatarURL())

        return await interaction.editReply({ components: [], embeds: [embed] });
    }
}
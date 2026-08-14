const { ContainerBuilder, TextDisplayBuilder, SectionBuilder, ThumbnailBuilder, MessageFlags, MediaGalleryBuilder, MediaGalleryItemBuilder } = require(`discord.js`);
const Awards = require("../models/Awards");
const { createEmbedStandard } = require("../modules");

module.exports = {
    name: "awsn",
    async execute(client, interaction, args) {
        const action = args.shift();
        const eventID = args.shift();

        const awardName = interaction.fields.getTextInputValue('awardName');
        const awardDesc = interaction.fields.getTextInputValue('awardDesc');

        const awardsNight = await Awards.findOne({ eventID });

        let arrayOfAwards = awardsNight.awards;
        arrayOfAwards.push({
            award: awardName,
            description: awardDesc
        });

        const newAwardsNight = await Awards.findOneAndUpdate({ eventID }, { awards: arrayOfAwards }, { returnDocument: "after" });

        let content = `# \`${newAwardsNight.eventName.toUpperCase()}\`\n### Awards:`;

        if (newAwardsNight.awards.length > 0) {
            let count = 1;
            for (x of newAwardsNight.awards) {
                content += `\n${count}. ${x.award} | \`NOMINEES: ${x.nominees.length}\``;
                count++;
            }
        } else {
            content += `\n *(No Awards Yet)*`;
        }

        const embed = createEmbedStandard()
            .setThumbnail(interaction.guild.iconURL())
            .setDescription(content);

        await interaction.update({ embeds: [embed] })

    }
}
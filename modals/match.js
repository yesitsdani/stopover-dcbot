const { getMatchData, updateMatch } = require("../models/Match");
const { matchmailBuilderGui, getMatchSettings } = require("../buttons/match");

module.exports = {
    name: "match",
    async execute(client, interaction, args) {
        const action = args.shift();
        const uid = interaction.user.id;
        const gid = interaction.guild.id;

        const ashimail = await getMatchData(uid);

        if (action == "write") {
            let mailBuilder = ashimail.mailBuilder;
            const content = interaction.fields.getTextInputValue('content');
            const msettings = await getMatchSettings(gid);

            mailBuilder[`title`] = `Match #${msettings.matchIndex + 1}`;
            mailBuilder[`content`] = `${content}`;
            mailBuilder[`uid`] = uid;

            const newAshiMail = await updateMatch(uid, { mailBuilder });

            return await interaction.update(matchmailBuilderGui(newAshiMail.mailBuilder));
        }
    }
}
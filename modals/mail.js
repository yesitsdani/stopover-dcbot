const { MessageFlags } = require("discord.js");
const { createEmbedStandard, getAshimail } = require("../modules");
const { Ashimail, updateAshimail } = require("../models/Ashimail");
const { loginGui, homepageGui, mailBuilderGui } = require("../buttons/mail");

module.exports = {
    name: "mail",
    async execute(client, interaction, args) {
        const action = args.shift();
        const uid = interaction.user.id;

        const ashimail = await getAshimail(uid);

        if (action == "new" || action == "login") {
            const username = interaction.fields.getTextInputValue('username');
            const password = interaction.fields.getTextInputValue('password');

            if (action == "new") {
                if (username.length > 20) return await interaction.update({ content: `❌ Username can only be 20 characters long at most` });
                if (username.includes(" ")) return await interaction.update({ content: `❌ Username cannot contain spaces` });
                if (username.includes("@")) return await interaction.update({ content: `❌ Username cannot contain '@'` });
                if (username.password > 30) return await interaction.update({ content: `❌ Password can only be 30 characters long at most` });

                try {

                    const newAshimail = await Ashimail.findOneAndUpdate(
                        { uid },
                        {
                            ashimailAddress: username,
                            ashimailPass: password,
                            registered: true
                        },
                        { returnDocument: "after" }
                    );

                    const gui = loginGui(interaction.user.avatarURL());
                    return await interaction.update({ embeds: [gui.embed], components: [gui.components] });

                } catch (err) {

                    console.log(err);
                    return await interaction.update({ content: `❌ Username \`${username}\` is already taken` });

                }
            } else if (action == "login") {
                const success = ashimail.ashimailAddress == username && ashimail.ashimailPass == password;

                if (!success) return await interaction.update({ content: `Incorrect Username and/or Password` });

                const sessionUntil = Date.now() + (1000 * 60 * 60 * 24);
                const newAshimail = await updateAshimail(uid, { sessionUntil });

                return await interaction.update(homepageGui(newAshimail));
            }
        } else if (action == "write") {
            let mailBuilder = ashimail.mailBuilder;
            const title = interaction.fields.getTextInputValue('title');
            const content = interaction.fields.getTextInputValue('content');
            const anonymous = interaction.fields.getCheckbox('anonymous');

            if (title.length > 100) return await interaction.update({ content: `❌ Subject can only be 100 characters long at most` });
            mailBuilder[`title`] = title;
            mailBuilder[`content`] = content;
            mailBuilder[`anon`] = anonymous;
            mailBuilder[`uid`] = uid;
            if (anonymous) mailBuilder[`signed`] = false;
            if (!anonymous) mailBuilder[`signed`] = true;

            const newAshiMail = await updateAshimail(uid, { mailBuilder });

            return await interaction.update(await mailBuilderGui(newAshiMail.mailBuilder));
        }
    },

    authEmbedMessage(authCase, authMessage) {
        let content = `# \`${authCase.toUpperCase()}\`\n> ${authMessage}`;
        const embed = createEmbedStandard()
            .setDescription(content);
        return embed;
    }
}
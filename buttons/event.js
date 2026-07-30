const { MessageFlags, ContainerBuilder, TextDisplayBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder } = require("discord.js")

module.exports = {
    name: "event",
    async execute(client, interaction, args) {
        const container = new ContainerBuilder()
                .setAccentColor(0xff2462)
        if (args[0] == "yes") {
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`SO YOU DARE\` <a:stp_pinkdiaheart:1532004326652772494>\n> I like your bravery...\n\nIru idwh uhzdugv wkrvh zkr fkrrvhv wr vwulnh lw, csy gsyveki wlepp xlir fi viaevhih. Rd Ufxxjwgd, hk hurj, lokxik, gtj kdiozotmre cozze. Mvy fvby joplm klthukz fvb vm pa. Nwz bpm eqvvmza apitt bism bpmqz xtikm... jwm cqn uxbnab vdbc kn ypp gsdr drosb roknc!\n\nWb qvsgg uoas ct hvs awbr, kvsfs gvozz mci ghobr? Kwhv hvs Jcfdoz gkcfr'g vwzh, cf pm hvs tssh ct hvsm kvc vczr wh?`)
                )

            await interaction.guild.channels.cache.find(channel => channel.id == "1504325792233164821").send(`<@${interaction.user.id}> pressed the event RSVP.`)
        } else if (args[0] == "lovesMe") {
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`YOU LOVE ME!?\` <a:stp_pinkdiaheart:1532004326652772494>\n> Nothing less is expected of a Passerby.\n\nIf I changed the world tomorrow, where shall you stand: by my side, or as my obstacle?`)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                    .addItems(
                        new MediaGalleryItemBuilder()
                        .setURL('https://external-preview.redd.it/hs31PvXsiDbxYMfuuZlINz2ztmoXEBsWVrGA9L2e1-I.gif?auto=webp&s=ad349fd60d2d1a781967deb3dfb1f45e91d70c82')
                    )
                )
            await interaction.guild.channels.cache.find(channel => channel.id == "1504325792233164821").send(`<@${interaction.user.id}> loves me`);
        } else if (args[0] == "lovesMeNot") {
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`HOW DARE YOU!?\` <a:stp_magentafire:1523665457868050522>\n> I don't speak politician, I'm a Queen. Your submission's what I need...\n\nf̴̧̗̮̮̞̰̼̺̥ͯ͑͛̋ͫ̌̓̚ơ̵̘̬̇̆͛ͩͣ͡͠r͂ ý̷̢̧̺͍̼͇͓͈̹͞o̶̸̡̦̰̝͙̼̤̲̯̤̔̀͊͐ͬ̈̇̉͟͠_̶̧̧͕͙͖̔̍ͤ́ͯ̊̀̀ͭu̡̫̮ h̢̡͙̲̩̝̠̦̅̀͒̂ͦ̈̈͌̐ͤ̇͑͆ͥ̑ͦ̒͆͜á̶̧̡̛̗͙̻̺̻̰̜͍̳̟͓̬͓̥͈̏͛̂ͫ̐ͩͫ͑̀̐̿͂̇͒ͮ͋ͮͧͨͬͪ͘͟͠v̼͖͍͎͚̼̗̦͕̙̗͎̦́̾̆̓̏̀͗ͣͩͯͯ̅̈́͒̑̎ͫͯ̍͊̓̃ͦ̈́̈͑́͒̕ͅe͕̟̝͈̓̐̍ͯͩͬ͢ f̵̴̨̢̨̛̳͇̻̩͉̯̼̰͈͍̮̜͆͆̄ͪͮ́̿ͦ̓̊́͊ͣ̅̿͂͆̄͘͝ơ̶̸̷͍̹̤̝̞͔̗̳̮̼̩̗̫͎̰͛̉ͪ̀̌̌̒ͭͤͨͭ̈́ͥͨ̏̓̄ͣ̎͢͝͡ͅrs̼̫̹̥̞̿͂͌́ả̷̜̪͇̤̘̮͍̝̼̫ͭ͗͊ͧ̈́̐͑̐ͭ̀̋̀̚͜͠k̲̼͚̣ͧͪ͂͂ͣ̉̎́e͖̯ͭ͐̂̿̒ṅ̷̛͚̪̹̹̝͚̱̩̱̥͖͚ͦ̐̔͋́̒̆̐͋̏͂̌ͧ̃̏͗ͧ m̵̢̤͇̫͕͖̳̪̠͙̝̯͛ͬ̈́̾́͌́ͩ͛̇ͫ̿̉ͦ͊͘e͖̙͍̩͕͕ͧ̄̏_ a̧̨̠̖̯̦͇̺̱͇̪̰̲̭͂́̏ͬ͆͆ͬ͛̈̊̚͝n̥͕̙͓̓ͯ̊͘͞d̴̶̵̸̢̥͈̟̻͍̝̘̖̣̦ͩͣͨ͋̋͋͒͑͐̃̚̕͝͞ d̡̙̣͓͍̎ͧ̿ë̙ͅc̡̨̲̤͖̞̳̠͖̦̟͈ͯ̊͆ͥ̏́́ͮͯ̉͆̆̇̃̑̉͘͟͜͡_̷͚̜̼́̇̽̊̔ͬl͕̬̠̎ͦ͑a̸̻̞̠̯̟̲͍̯͍ͩ͊͛͗ͭͮ͌̾͆̎̒͊̈̊r̝_ę̷̵̵̶̢̡̝̭̜͎̞̺̙͙̪̯̼̞͙̹̗͎̘ͥͭ͐ͨ̇̎̋ͬͧ̾́͒͊͟͟͡͝͠ḑ̸̵̴̛̛͚̜̜̯̭͓̅́ͥͧ̂́̔̓̄ͯ́ͦ̓ͫ͑ͦ̿͘͘͟͞ͅ y̨̻̥̹̭̱̲̱̞̞͌̀̈́͑ͣͨ͜͟͡oͦư̸͙̖̱̠̞̟ͯ̄ͣ͒͋̑ͤ̆_̠̮̮ͯͫ͗ͣͭṛ̶̣͕͎̠̟̭͈̟̝̣̯ͤ͂̀̆ͭͧ̓̃̆͗ͦͭ̌̋̌͌ͨ̀͢͢͢͞ h̨̧̪̯̹̠͒ͭͨ͒̓̊̿̆̐͋ͨ̚͡e̸̤̲̱ͥͨ̌̅͟͟a̷̧̧̧̲̤̺̙̞̰̣̘̰̮̰̦̮̓̋ͫ̉ͯ̏͟͟r̝̖̭ͣ_̡͎̰͓̙̮̖͉̰̳̺̪͓̀̔̓͗̌͗̈́̽̎̄̌̌ͮ̈́̋ͬ͑ͣ̄̋́ͪ̚͞͝͝t̨̻̱͚̼̙̲̦̫̼͓̳̪̆ͥ̅ͩ͂́̉ͫͨͤ̽͋̄͟͡͝͝ u̴̪͚̠̎̎͒͋̓̈ͣ̓̃ͣ̍_̶̛͚̗̝͍͕͔̱͎̄ͦ̑̊̋̿̀̆̌̄̾ͬ̉͝͞͞n̨̳̠͗̂̇o̸̡̱̜̗̙̞͓̫͇͉͈̖͈̝͓͓̓̐̅̊͒̊̉ͯͯ̓̽͛̄ͭ͋͆̊̑̐͠ẅ̻͚́̉n̷̦̝̳͉̙̓͐̋̀̾͋̇͟ę̢̯͇͍͖̙̟͓͎͒̂̈́ͦ̒ͬ̔̓͋͝ͅd̻̰͋̿͢͠ b̮̺͙̫̘̿͛̍ͦy̭͇̺͓̿́͢_̨̨̠̲̻͎̭̣͈̳͔͖̍̽ͭͪ̐̈́ͪ̾̓̈̚ th̳̬_̡̬͈̖̩̪̝̟͖͈̬͕̈̔̇ͩͮ̾̐͆ͯͭ͐̋͘͢ͅe̘̞͛͒̔̌_͉̭̖̖̻͍͙̹̠̹̋̀̋̈ c̸̵̸̗̪̣͕̪̪̭͇̭͗̀͒̊͋ͭ̌ͭͬ̃̀̅̈́ͭͤ́̏͗ͬͥ̓̚̚͢͞r̵̮̪̟͋̓ͨ̀͒̂͊͋͠_̳ͩ͒̔ͨͯͧ_̸̛̟͍͎̰̭̭̙͚͒̀́ͭ͌͒̾ͣ͛͘͘͟͢͠o̷̟̙̟̎ͬ́wn̵̻̪̩̭̻̦̗̖̞͉̈͑̀̌̇͑̎ͩͥ̿̒͞͞͝,̶͔̓̑̈́̎͊̄̎͢ į̷͖ͪ̑͆͡t͎ͥ͌ ṡ̶̸̼͓̺͚̖̖̗͍̋͐ͯ̈́̈́̅̾̓ͦ̆̏ͦ͘͢͟h̶̳͇̄̔ͩ̕a̸̡̡̧̢̤̭̦̰̹͋ͤ̈ͤl_̸̛͚̙̫̩̮̖͉͍͈̗͇͎͖̞͈͊ͫ̐̒ͫ̔̉̿̋̀̇̈͜l̛͓̮̥̬̳͙͚̱͈̫ͫ̀̎́͂ͩ͂̚̚͠͞ î̶̸̶̝̱̖̯̩̲͕ͣ͗͗͆̏́̈́ͨ̽͌͝͞n̷̴̢̜͚͓̬͉̩̠͔̪̫̎̏̽͊̊ͭ͗̌͑ͧ̀ͮͥ͆ͮ͢͢͟͜ͅs̴̢̪͎͋̒̄ͬ͑ͭͥ͞ṭ̶̵̵̸̝̗̮͖̳̘̖̰̼̎̌̃ͦ͑͊ͦͤͭ̔͠ẻ̷̵͔̲̼̺̠̯̫͓̦̻̜̼̫͇̭̼̼̐͌́̏ͣ͌͛͊ͮ̉́̓̿̈̈́ͬ̚͢͡͝ͅą̢̧̝͍̲̙̳̬͎͔͎̳̝̇̈̋̉̍ͩͯ͂ͩ̅́̋͊̾̕̕͟͠͡ͅͅḓ̟͈̱ͧ̾ͫͫ̓͒̓̾͜ b̶̨̧̢̻̖̥̻̪̼̥̒̉ͧ̀ͯ̽́ͮ̒͆̚͝͡ȩ͕̭̻͖̦͇̼̙̋ͦ͒̐ͧ͐͜ͅ s̶̛̥̟͔͓͑̋ͣ̊͟e̸̶͈̲̼̫͖̫̳͙͚̱͎͇̱̅̎ͮͦ͂́̐̏́̾̑̃̽̓̌͆̊̓ͭͬͥ͗̂͜͝͡͝r̬̙̗̙̻̳̥̜̱͆́ͮ̈͗ͫ̔͋͝͠v̰ͣé̡̡̛̞̪͈͔̝̯̺̪̯̘̪̟͖̘̥͎̺̌̾̈̿ͪ̊̈́̌ͪ̽ͤ̒̾̀̇͘͘͢͜͞͝d̮ͤ i̸̧̛̛̫͕̖̪͉̬̜͔͍͖̺̫̜̙̙̥͕͓̳͙̘̟̫͇͐ͣ̅͗ͬͧ̓͋ͨ̚͡͝͡͝͡͞͡ͅn̸̢̲͙̟̦͈͔ͫ̐̾̾͋͛̓̎̓̋̕͟͟͡ ą̸̸̛͚̼̼̣̭̠̹͔̘ͪ̆̂̽ͮ́ͤ̅̑ͬͪ͗͒͆ͣ̎̚͠͡ p̷̶̸̧͕͎̜̤̖̝̳̳͕̙ͨͪ̌̊ͣ̏͌̿͂̄ͯͭͤ̽͂̈́ͪ͋̀ͣ̍͘̕͟͠ļ̵̨̥̞́͊̀̂ͮ͜a̴̴̵̧̼̹̙͔̙̱̺̳̞̔̎ͮ̑̌ͥ̀ͥͮ̽ͫ͂̈́̂̋̑̍̊͗ͦ͟͝͠͝t̵̡̢̧̟͔͕̝̗̪̝͕͕̰̹̟̟̝̜̹͇̺̯͈̒ͮͤ̂́ͬ̅̆̈́͌̈ͧ̇͌̀̐̆ͫ̚͜͢͠e̬̝̾̋ ǒ̧̲̙̪͈̿ͮ͌̀͟f̡̬͙̲̙̱̣͉͈͔̥̺̙̹̝ͩͪͬ̈́̓ͪ̐̏́͆̌̉̽̊̈̇̍͟͟͠ͅ s̨̛͇̪̭̤͙͇̮̗̬̠̒̊̽̍͌ͬ͛̆ͮ̀̉̉̄̔͠ͅi̵̛̛̞̫̣͍̳̭͖ͥ́͌̽ͫ̿̂̽ͪ̕̚͢͝͠l̪͔̻͇̹͓͗͐ͭͯ͂̔́̆͜͞v̡̛̤̤̰͙̟̼̪̝̰̽ͣ̄̓̌ͯ͊ͭͤ̊ͭ̀ͤͧ̈̎̕͟͠͞e̶̘̗͕͙̝̻̝͋̉̇́̉̂͑ͬ̊̃̒̈́͟͝͝ͅr͟.̲̥͉͐͟ `)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                    .addItems(
                        new MediaGalleryItemBuilder()
                        .setURL('https://pixelnoizz.wordpress.com/wp-content/uploads/2012/03/bus_1.gif')
                    )
                )
            await interaction.guild.channels.cache.find(channel => channel.id == "1504325792233164821").send(`<@${interaction.user.id}> loves me not`);
        } else if (args[0] == "curiosity") {
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`SOMEONE'S CURIOUS...\``)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                    .addItems(
                        new MediaGalleryItemBuilder()
                        .setURL('https://imgur.com/HDjLlKe.png')
                    )
                )
            await interaction.guild.channels.cache.find(channel => channel.id == "1504325792233164821").send(`<@${interaction.user.id}> is curious`);
        } else if (args[0] == "hint") {
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`WHAT IS THIS?\``)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                    .addItems(
                        new MediaGalleryItemBuilder()
                        .setURL('https://imgur.com/BET6ydQ.png')
                    )
                )
            await interaction.guild.channels.cache.find(channel => channel.id == "1504325792233164821").send(`<@${interaction.user.id}> got a hint`);
        }
        await interaction.reply({ flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] });
    }
}
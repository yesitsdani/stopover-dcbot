module.exports = {
    name: 'chaos',
    description: 'chaos',
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        if (!args[0]) return await message.reply(`Use the arguments: \`teststart\`, \`testend\`, ⚠️\`quickstart\`, ⚠️\`start\`, ⚠️\`end\`, ⚠️\`maze\``);
        const valid = ['teststart', 'testend', 'start', 'end', 'maze', 'quickstart'];
        if (!valid.includes(args[0].toLowerCase())) return await message.reply(`Use the arguments: \`teststart\`, \`testend\`, ⚠️\`quickstart\`, ⚠️\`start\`, ⚠️\`end\`, ⚠️\`maze\``);

        let rolesToAdd = [];

        if (args[0].toLowerCase() == "teststart" || args[0].toLowerCase() == "testend") rolesToAdd = ['1532451733882802186'];
        if (args[0].toLowerCase() == "start") rolesToAdd = ['1531529841717809232'];
        if (args[0].toLowerCase() == "maze") rolesToAdd = ['1532389210827391066'];
        if (args[0].toLowerCase() == "quickstart") rolesToAdd = ['1532389210827391066', '1531529841717809232'];
        if (args[0].toLowerCase() == "end") rolesToAdd = ['1532389210827391066', '1531529841717809232', '1532389393162305546'];

        // Roles to EXCLUDE
        const excludeRole1 = "1507597348363309168";
        const excludeRole2 = "1511533587831324703";

        const guild = message.guild;
        const announceChannel = guild.channels.cache.get('1505071480835276900')
        if (args[0].toLowerCase() == "start" || args[0].toLowerCase() == "quickstart") {
            await announceChannel.send(`Attention all <@&1504331357386440704>, the Chief has declared the start of the Escape Room. Be prepared.`)
        } else if (args[0].toLowerCase() == "end") {
            await announceChannel.send(`Attention all <@&1504331357386440704>, the Chief has declared the end of the Escape Room. Thank you for Playing!`)
        } else {
            await announceChannel.send(`Mic check, Mic check! Pasabog si Badette! (this is a test command; please ignore. thanks!)`)
        }

        await message.reply(`As you wish, Your Majesty.`);

        await guild.members.fetch();

        let updated = 0;
        let skipped = 0;

        for (const member of guild.members.cache.values()) {

            // Skip bots (optional)
            if (member.user.bot) continue;

            // Skip members with excluded roles
            if (
                member.roles.cache.has(excludeRole1) ||
                member.roles.cache.has(excludeRole2)
            ) {
                skipped++;
                continue;
            }

            try {
                if (
                    args[0].toLowerCase() == "teststart" ||
                    args[0].toLowerCase() == "start" ||
                    args[0].toLowerCase() == "maze") {
                    await member.roles.add(rolesToAdd);
                } else {
                    await member.roles.remove(rolesToAdd);
                }
                updated++;
            } catch (err) {
                console.log(`Couldn't update ${member.user.tag}:`, err.message);
            }
        }

        message.reply(
            `Done!\nUpdated: ${updated}\nSkipped: ${skipped}`
        );
    }
}
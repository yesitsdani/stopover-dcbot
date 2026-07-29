const { MessageFlags, ContainerBuilder, TextDisplayBuilder } = require("discord.js")

module.exports = {
    name: "event",
    async execute(client, interaction, args) {
        const container = new ContainerBuilder()
        .setAccentColor(0xFF0800)
        .addTextDisplayComponents(
            new TextDisplayBuilder()
            .setContent(`# \`SO YOU DARE\` <a:stp_pinkdiaheart:1532004326652772494>\n> I like your bravery...\n\nIru idwh uhzdugv wkrvh zkr fkrrvhv wr vwulnh lw, csy gsyveki wlepp xlir fi viaevhih. Rd Ufxxjwgd, hk hurj, lokxik, gtj kdiozotmre cozze. Mvy fvby joplm klthukz fvb vm pa. Nwz bpm eqvvmza apitt bism bpmqz xtikm... jwm cqn uxbnab vdbc kn ypp gsdr drosb roknc!\n\nWb qvsgg uoas ct hvs awbr, kvsfs gvozz mci ghobr? Kwhv hvs Jcfdoz gkcfr'g vwzh, cf pm hvs tssh ct hvsm kvc vczr wh?`)
        )

        await interaction.guild.channels.cache.find(channel => channel.id == "1504325792233164821").send(`<@${interaction.user.id}> pressed the event RSVP.`)

        await interaction.reply({ flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] });
    }
}
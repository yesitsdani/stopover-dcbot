const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, EmbedBuilder, Collection, MessageFlags, InteractionType } = require('discord.js');
const { TOKEN, TEST_TOKEN } = require('./config.json');
const { channels, pairs, users } = require('./pairing-event.json');
const connectToDatabase = require('./db_connect');

const token = TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences
    ]
});

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    console.log({
        tag: client.user.tag,
        botUserId: client.user.id,
        applicationId: client.application.id,
    });
});

client.prefix_commands = new Collection();
client.buttons = new Collection();

const foldersPath = path.join(__dirname, 'prefix_commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('name' in command && 'execute' in command) {
            client.prefix_commands.set(command.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "name" or "execute" property.`);
        }
    }
}

const buttons = fs.readdirSync("./buttons");
for (file of buttons) {
    const buttonName = file.split(".")[0];
    const button = require(`./buttons/${file}`);
    client.buttons.set(buttonName, button)
}

client.on(Events.MessageCreate, async (message) => {
    let event = require('./events/MessageCreate.js');
    await event.run(client, message);
}
);

client.on(Events.InteractionCreate, async (interaction) => {
    /*
    let event;
    if (interaction.isButton()) event = require('./events/InteractionButton.js');
    await event.run(client, interaction);*/
    if (!interaction.isButton()) return;

    console.log("Button clicked");

    try {
        await interaction.reply({
            content: "Hello!",
            flags: MessageFlags.Ephemeral,
        });

        console.log("Reply succeeded");
    } catch (err) {
        console.error(err);
    }
});

// Log in to Discord with your client's token
(async () => {
    //await connectToDatabase();
    await client.login(token);
})();
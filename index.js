require('dotenv').config({quiet: true});
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, EmbedBuilder, Collection, MessageFlags, InteractionType } = require('discord.js');
const { channels, pairs, users } = require('./pairing-event.json');
const connectToDatabase = require('./db_connect');

//Uncomment when not deployed
const token = process.env.TEST_TOKEN;
const MDB_SRV = process.env.MDB_SRV;

//Uncomment when deployed
//const token = ${{ TOKEN }};
//const MDB_SRV = ${{ MDB_SRV }};

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

client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    await client.user.setPresence({
        activities: [
            {
                name: "hello, hi, mabuhay! :))"
            }
        ],
        status: 'dnd'
    });
});

client.prefix_commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

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

const modals = fs.readdirSync("./modals");
for (file of modals) {
    const modalName = file.split(".")[0];
    const modal = require(`./modals/${file}`);
    client.modals.set(modalName, modal);
}

client.on(Events.MessageCreate, async (message) => {
    let event = require('./events/MessageCreate.js');
    await event.run(client, message, process.env.PREFIX);
}
);

client.on(Events.InteractionCreate, async (interaction) => {
    let event;
    if (interaction.isButton()) event = require('./events/InteractionButton.js');
    if (interaction.isModalSubmit()) event = require('./events/ModalSubmit.js');
    await event.run(client, interaction);
});

// Log in to Discord with your client's token
(async () => {
    //await connectToDatabase(MDB_SRV);
    await client.login(token);
})();
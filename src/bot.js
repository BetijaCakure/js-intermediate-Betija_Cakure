import { Client, GatewayIntentBits } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import 'dotenv/config';
import {commandHelper, buttonInteractions} from '../commands/commands.js';

const token = process.env.DISCORD_BOT_TOKEN;
const botId = process.env.BOT_ID;
const guildId = process.env.GUILD_ID;


const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

client.on('ready', () => {
    console.log(`Logged in!`);
});

client.on('messageCreate', message => {
    console.log(`${message.author.tag} wrote: ${message.content}`);
});

const commandData = commandHelper.map(cmd => ({
    name: cmd.name,
    description: cmd.description,
    options: cmd.options || []
}))

const rest = new REST({version: 9}).setToken(token);

(async () => {
    try {
        console.log('Started refreshing (/) commands');

        const currentCommands = await rest.get(
            Routes.applicationGuildCommands(botId, guildId)
        );

        for (const command of currentCommands) {
            await rest.delete(Routes.applicationGuildCommand(botId, guildId, command.id))
        };

        await rest.put(Routes.applicationCommands(botId, guildId), {body: commandData});

        console.log('Commands added successfully');
    } catch (error) {
        console.error(error);
    }
})()

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const { commandName, options } = interaction;

        commandHelper.forEach(command => {
            if (commandName === command.name) {
                command.action(interaction, options);
            }
        })
    }
    else if (interaction.isButton()) {
        await buttonInteractions(interaction);
    }
})

client.login(token);
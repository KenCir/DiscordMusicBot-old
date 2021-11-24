require('dotenv').config();
const { Intents } = require('discord.js');
const { readdirSync, readdir } = require('fs');
const path = require('path');
const MusicBot = require('./MusicBot');
const client = new MusicBot({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
    allowedMentions: {
        parse: [],
        repliedUser: false,
    },
});

readdir(path.join(__dirname, '/events/process/'), (err, files) => {
    if (err) return client.logger.error(err);
    files.forEach((file) => {
        const event = require(path.join(__dirname, `/events/process/${file}`));
        const eventName = file.split('.')[0];
        process.on(eventName, event.bind(null, client));
        client.logger.info(`Process ${eventName} event is Loading`);
    });
});

readdir(path.join(__dirname, '/events/discord/'), (err, files) => {
    if (err) return client.logger.error(err);
    files.forEach((file) => {
        const event = require(path.join(__dirname, `/events/discord/${file}`));
        const eventName = file.split('.')[0];
        client.on(eventName, event.bind(null, client));
        client.logger.info(`Discord ${eventName} event is Loading`);
    });
});

readdir(path.join(__dirname, '/events/music/'), (err, files) => {
    if (err) return client.logger.error(err);
    files.forEach((file) => {
        const event = require(path.join(__dirname, `/events/music/${file}`));
        const eventName = file.split('.')[0];
        client.player.on(eventName, event.bind(null, client));
        client.logger.info(`Music ${eventName} event is Loading`);
    });
});

const commandFolders = readdirSync(path.join(__dirname, '/commands'));
for (const folder of commandFolders) {
    const commandFiles = readdirSync(path.join(__dirname, '/commands/', folder)).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(__dirname, '/commands/', folder, file));
        client.commands.set(command.info.name, command);
        client.logger.info(`${command.info.name} command is Loading`);
    }
}

client.login()
    .catch(err => {
        client.logger.fatal(err);
        process.exit(-1);
    });
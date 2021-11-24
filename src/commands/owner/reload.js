const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Message } = require('discord.js');
const { readdirSync } = require('fs');
const { CommandError_Message } = require('../../functions/Error');
const MusicBot = require('../../MusicBot');

module.exports = {
    info: {
        name: 'reload',
        description: '全コマンドをリロードする',
        usage: 'reload',
        aliases: [],
        category: 'owner',
        isPlayed: false,
        isVoiceConnected: false,
    },

    data: new SlashCommandBuilder(),

    /**
     * @param {MusicBot} client
     * @param {CommandInteraction} interaction
     */
    // eslint-disable-next-line no-empty-function
    run: async function (client, interaction) {
    },

    /**
     * @param {MusicBot} client
     * @param {Message} message
     * @param {string[]} args
     */
    run_message: async function (client, message, args) {
        try {
            const msg = await message.reply('コマンドの再読み込みを開始...');

            client.commands.clear();
            const commandFolders = readdirSync(`${__dirname}/../../commands`);
            for (const folder of commandFolders) {
                const commandFiles = readdirSync(`${__dirname}/../../commands/${folder}`).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    delete require.cache[require.resolve(`../../commands/${folder}/${file}`)];
                    const command = require(`../../commands/${folder}/${file}`);
                    client.commands.set(command.info.name, command);
                    client.logger.info(`${command.info.name} command is ReLoading`);
                }
            }

            await msg.edit(`合計${client.commands.size}個のコマンドを再読み込みしました`);
        }
        catch (error) {
            CommandError_Message(client, message, error);
        }
    },
};
const { SlashCommandBuilder, channelMention } = require('@discordjs/builders');
const { CommandInteraction, Message } = require('discord.js');
const { commandError_Message } = require('../../functions/error');
const MusicBot = require('../../MusicBot');

module.exports = {
    info: {
        name: 'seek',
        description: '移動',
        usage: 'seek',
        aliases: [],
        category: 'music',
        isPlayed: true,
        isVoiceConnected: true,
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
            const queue = client.player.getQueue(message.guild.id);
            queue.seek(args[0]);
            await message.reply('Seeked');
        }
        catch (error) {
            commandError_Message(client, message, error);
        }
    },
};
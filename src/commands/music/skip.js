const { SlashCommandBuilder } = require('@discordjs/builders');
const { RepeatMode } = require('discord-music-player');
const { CommandInteraction, Message } = require('discord.js');
const { commandError_Message } = require('../../functions/error');
const MusicBot = require('../../MusicBot');

module.exports = {
    info: {
        name: 'skip',
        description: '再生中の曲をスキップする',
        usage: 'skip',
        aliases: ['s'],
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
            const queue = client.player.getQueue(message.guildId);
            if (queue.repeatMode === RepeatMode.SONG) {
                queue.setRepeatMode(RepeatMode.DISABLED);
                queue.data.skipLoop = true;
            }

            queue.skip();
            await message.reply('再生中の曲をスキップしました');
        }
        catch (error) {
            commandError_Message(client, message, error);
        }
    },
};
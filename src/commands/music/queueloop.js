const { SlashCommandBuilder } = require('@discordjs/builders');
const { RepeatMode } = require('discord-music-player');
const { CommandInteraction, Message } = require('discord.js');
const { CommandError_Message } = require('../../functions/Error');
const MusicBot = require('../../MusicBot');

module.exports = {
    info: {
        name: 'queueloop',
        description: 'キューを表示する',
        usage: 'queueloop',
        aliases: ['qloop'],
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
            if (queue.repeatMode !== RepeatMode.QUEUE) {
                queue.setRepeatMode(RepeatMode.QUEUE);
                await message.reply('キューをループ再生します');
            }
            else {
                queue.setRepeatMode(RepeatMode.DISABLED);
                await message.reply('キューのループ再生を解除しました');
            }
        }
        catch (error) {
            CommandError_Message(client, message, error);
        }
    },
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const { RepeatMode } = require('discord-music-player');
const { CommandInteraction, Message, MessageEmbed } = require('discord.js');
const { CommandError_Message } = require('../../functions/Error');
const MusicBot = require('../../MusicBot');

module.exports = {
    info: {
        name: 'loop',
        description: '再生中の曲をループ再生する',
        usage: 'loop',
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
            const queue = client.player.getQueue(message.guildId);
            if (!queue || !queue.isPlaying) return await message.reply('曲を再生していません');
            if (queue.repeatMode !== RepeatMode.SONG) {
                queue.setRepeatMode(RepeatMode.SONG);
                await message.reply('再生中の曲をループ再生にしました');
            }
            else {
                queue.setRepeatMode(RepeatMode.DISABLED);
                await message.reply('再生中の曲のループ再生を解除しました');
            }
        }
        catch (error) {
            CommandError_Message(client, message, error);
        }
    },
};
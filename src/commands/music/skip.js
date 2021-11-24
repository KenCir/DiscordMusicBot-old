const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Message } = require('discord.js');
const { CommandError_Message } = require('../../functions/Error');
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
            if (!message.member.voice.channel) return await message.reply('ボイスチャンネルに参加していないとこのコマンドは使用できません');
            const queue = client.player.createQueue(message.guild.id, {
                data: {
                    channel: message.channel,
                },
            });
            if (!queue.isPlaying) return await message.reply('このコマンドは曲が再生中でないと使用できません');
            queue.skip();
            await message.reply('再生中の曲をスキップしました');
        }
        catch (error) {
            CommandError_Message(client, message, error);
        }
    },
};
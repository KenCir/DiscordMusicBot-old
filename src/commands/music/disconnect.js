const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Message } = require('discord.js');
const { CommandError_Message } = require('../../functions/Error');
const MusicBot = require('../../MusicBot');

module.exports = {
    info: {
        name: 'disconnect',
        description: '再生を停止してVCから退出します',
        usage: 'disconnect',
        aliases: ['dc'],
        category: 'music',
        isPlayed: false,
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
            if (!queue || !queue.connection) return await message.reply('このコマンドはBotがVCに参加していないと使用できません');
            queue.destroy(true);
        }
        catch (error) {
            CommandError_Message(client, message, error);
        }
    },
};
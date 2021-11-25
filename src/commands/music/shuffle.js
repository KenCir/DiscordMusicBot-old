const { SlashCommandBuilder, channelMention } = require('@discordjs/builders');
const { CommandInteraction, Message } = require('discord.js');
const { CommandError_Message } = require('../../functions/Error');
const MusicBot = require('../../MusicBot');

module.exports = {
    info: {
        name: 'shuffle',
        description: 'キューをシャッフルする',
        usage: 'shuffle',
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
            queue.shuffle();
            await message.reply('キューの曲をシャッフルしました');
        }
        catch (error) {
            CommandError_Message(client, message, error);
        }
    },
};
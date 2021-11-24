const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Message } = require('discord.js');
const { CommandError_Message } = require('../../functions/Error');
const MusicBot = require('../../MusicBot');

module.exports = {
    info: {
        name: 'playlist',
        description: 'キューにプレイリストを追加する',
        usage: 'playlist [URL]',
        aliases: [],
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
            if (!args[0]) return await message.reply('引数にキューに追加する再生リストのURLを入れてください');
            const queue = client.player.createQueue(message.guild.id, {
                data: {
                    channel: message.channel,
                },
            });
            await queue.join(message.member.voice.channel);
            await queue.playlist(args.join(' '));
        }
        catch (error) {
            CommandError_Message(client, message, error);
        }
    },
};
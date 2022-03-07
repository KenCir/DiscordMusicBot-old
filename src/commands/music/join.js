const { SlashCommandBuilder, channelMention } = require('@discordjs/builders');
const { CommandInteraction, Message } = require('discord.js');
const { commandError_Message } = require('../../functions/error');
const MusicBot = require('../../MusicBot');

module.exports = {
    info: {
        name: 'join',
        description: 'VCに参加します',
        usage: 'join',
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
            const queue = client.player.getQueue(message.guild.id) || client.player.createQueue(message.guild.id, {
                data: {
                    channel: message.channel,
                    playMsg: null,
                    skipLoop: false,
                },
            });
            if (!queue.connection) {
                await queue.join(message.member.voice.channel);
                await message.reply(`${channelMention(message.member.voice.channelId)}に接続しました\n${channelMention(message.channelId)}をコマンドチャンネルに設定しました`);
            }
            else if (queue.data.channel.id !== message.channelId) {
                queue.channel = message.channel;
                await message.reply(`${channelMention(message.channelId)}をコマンドチャンネルに設定しました`);
            }
            else {
                await message.reply('既にVC接続済みです');
            }
        }
        catch (error) {
            commandError_Message(client, message, error);
        }
    },
};
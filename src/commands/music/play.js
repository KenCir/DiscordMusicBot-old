const { SlashCommandBuilder, channelMention } = require('@discordjs/builders');
const { CommandInteraction, Message } = require('discord.js');
const { commandError_Message } = require('../../functions/error');
const MusicBot = require('../../MusicBot');

module.exports = {
    info: {
        name: 'play',
        description: 'キューに曲を追加する',
        usage: 'play [曲名 or URL]',
        aliases: ['p'],
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
            if (!args[0]) return await message.reply('引数にキューに追加する曲名かURLを入れてください');
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
                queue.setData({
                    channel: message.channel,
                });
                await message.reply(`${channelMention(message.channelId)}をコマンドチャンネルに設定しました`);
            }


            queue.play(args.join(' ') + '&bpctr=9999999999', {
                requestedBy: message.author,
                timecode: true,
            })
                .catch(() => queue.playlist(args.join(' ') + '&bpctr=9999999999', {
                    requestedBy: message.author,
                }))
                .catch(async err => await message.channel.send(`曲が見つかりませんでした、存在しないURL・再生リストを指定していませんか？\n\n${err.stack}`));
        }
        catch (error) {
            commandError_Message(client, message, error);
        }
    },
};
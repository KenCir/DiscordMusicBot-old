const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Message, MessageEmbed } = require('discord.js');
const { commandError_Message } = require('../../functions/error');
const MusicBot = require('../../MusicBot');

module.exports = {
    info: {
        name: 'nowplaying',
        description: '再生中の曲を表示する',
        usage: 'nowplaying',
        aliases: ['np'],
        category: 'music',
        isPlayed: true,
        isVoiceConnected: false,

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
            await message.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle('NowPlaying♪')
                        .setURL(queue.nowPlaying.url)
                        .addField('タイトル', queue.nowPlaying.name)
                        .addField('チャンネル名', queue.nowPlaying.author)
                        .addField('曲の長さ', queue.nowPlaying.duration)
                        .addField('プログレスバー', queue.createProgressBar().prettier)
                        .setImage(queue.nowPlaying.thumbnail)
                        .setColor('RANDOM')
                        .setTimestamp(),
                ],
            });
        }
        catch (error) {
            commandError_Message(client, message, error);
        }
    },
};
const { Playlist, Queue } = require('discord-music-player');
const { MessageEmbed } = require('discord.js');
const { hyperlink } = require('@discordjs/builders');
const MusicBot = require('../../MusicBot');
const { ErrorLog } = require('../../functions/Error');

/**
 * @param {MusicBot} client
 * @param {Queue} queue
 * @param {Playlist} playlist
 */
module.exports = async (client, queue, playlist) => {
    try {
        client.logger.info(`キューにプレイリスト ${playlist.name}、合計${playlist.songs.length}曲が追加されました\n${playlist.url}`);
        client.logger.info('追加された曲');
        for (const song of playlist.songs) client.logger.info(`${song.name} ${song.url}`);
        await queue.data.channel.send({
            content: `キューにプレイリスト${playlist.name}、合計${playlist.songs.length}曲が追加されました\n${playlist.url}`,
            embeds: [
                new MessageEmbed()
                    .setTitle('追加された曲')
                    .setDescription((playlist.songs.map(song => `${hyperlink(song.name, song.url)}`).join('\n')).length > 4096 ? '文字数が4096文字を超過しているため表示できません' : playlist.songs.map(song => `${hyperlink(song.name, song.url)}`).join('\n'))
                    .setColor('RANDOM')
                    .setTimestamp(),
            ],
        });
    }
    catch (error) {
        ErrorLog(client, error);
    }
};
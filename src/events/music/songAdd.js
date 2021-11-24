const { Queue, Song } = require('discord-music-player');
const { ErrorLog } = require('../../functions/Error');
const MusicBot = require('../../MusicBot');

/**
 * @param {MusicBot} client
 * @param {Queue} queue
 * @param {Song} song
 */
module.exports = async (client, queue, song) => {
    try {
        client.logger.info(`キューに${song.name} ${song.url} が追加されました`);
        await queue.data.channel.send(`キューに${song.name}が追加されました\n${song.url}`);
    }
    catch (error) {
        ErrorLog(client, error);
    }
};
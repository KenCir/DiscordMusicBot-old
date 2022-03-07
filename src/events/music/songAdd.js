const { formatEmoji } = require('@discordjs/builders');
const { Queue, Song } = require('discord-music-player');
const { errorLog } = require('../../functions/error');
const MusicBot = require('../../MusicBot');
const emojis = require('../../../dat/emojis.json');

/**
 * @param {MusicBot} client
 * @param {Queue} queue
 * @param {Song} song
 */
module.exports = async (client, queue, song) => {
    try {
        client.logger.info(`キューに${song.name} ${song.url} が追加されました`);

        await queue.data.channel.send(`${formatEmoji(emojis.sorena)}キューに${song.name}が追加されました\n${song.url}`);
    }
    catch (error) {
        errorLog(client, error);
    }
};
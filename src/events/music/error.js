const { Queue } = require('discord-music-player');
const { errorLog } = require('../../functions/error');
const MusicBot = require('../../MusicBot');
const emojis = require('../../../dat/emojis.json');
const { formatEmoji } = require('@discordjs/builders');

/**
 * @param {MusicBot} client
 * @param {strin} error
 * @param {Queue} queue
 */
module.exports = async (client, error, queue) => {
    try {
        client.logger.error(error);
        await queue.data.channel.send(`${formatEmoji(emojis.donatu)}エラーが発生しました\n${error}`);
    }
    catch (_error) {
        errorLog(client, _error);
    }
};
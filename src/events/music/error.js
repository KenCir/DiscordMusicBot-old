const { Queue } = require('discord-music-player');
const { ErrorLog } = require('../../functions/Error');
const MusicBot = require('../../MusicBot');

/**
 * @param {MusicBot} client
 * @param {strin} error
 * @param {Queue} queue
 */
module.exports = async (client, error, queue) => {
    try {
        client.logger.error(error);
        await queue.data.channel.send(`エラーが発生しました\n${error}`);
    }
    catch (_error) {
        ErrorLog(client, _error);
    }
};
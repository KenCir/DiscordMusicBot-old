const { Queue } = require('discord-music-player');
const { errorLog } = require('../../functions/error');
const MusicBot = require('../../MusicBot');

/**
 * @param {MusicBot} client
 * @param {Queue} queue
 */
module.exports = async (client, queue) => {
    try {
        client.logger.info(`${queue.guild.name}(ID: ${queue.guild.id})のキュー再生が終了しました`);
        client.user.setActivity(`${process.env.PREFIX}help`, { type: 'LISTENING' });
        // if (queue.data.playMsg) await queue.data.playMsg.delete();
    }
    catch (error) {
        errorLog(client, error);
    }
};
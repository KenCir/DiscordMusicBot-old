const { Queue } = require('discord-music-player');
const { ErrorLog } = require('../../functions/Error');
const MusicBot = require('../../MusicBot');

/**
 * @param {MusicBot} client
 * @param {Queue} queue
 */
module.exports = async (client, queue) => {
    try {
        client.logger.info(`${queue.guild.name}(ID: ${queue.guild.id})のキュー再生が終了しました`);
        client.user.setActivity(`${process.env.PREFIX}help`, { type: 'LISTENING' });
        if (client.startmsgs.get(queue.guild.id)) await queue.data.channel.messages.cache.get(client.startmsgs.get(queue.guild.id)).delete();
        client.startmsgs.delete(queue.guild.id);
    }
    catch (error) {
        ErrorLog(client, error);
    }
};
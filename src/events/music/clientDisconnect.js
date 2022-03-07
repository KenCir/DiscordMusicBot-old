const { Queue } = require('discord-music-player');
const { errorLog } = require('../../functions/error');
const MusicBot = require('../../MusicBot');
const emojis = require('../../../dat/emojis.json');
const { formatEmoji } = require('@discordjs/builders');

/**
 * @param {MusicBot} client
 * @param {Queue} queue
 */
module.exports = async (client, queue) => {
    try {
        client.logger.info(`${queue.guild.name}(ID: ${queue.guild.id})のボイスチャンネルから切断されました`);
        queue.destroy();
        await queue.data.channel.send(`${formatEmoji(emojis.donatu)}ボイスチャンネルから切断されたため、再生を終了しました`);
        if (client.startmsgs.get(queue.guild.id)) await queue.data.channel.messages.cache.get(client.startmsgs.get(queue.guild.id)).delete();
        client.startmsgs.delete(queue.guild.id);
    }
    catch (error) {
        errorLog(client, error);
    }
};
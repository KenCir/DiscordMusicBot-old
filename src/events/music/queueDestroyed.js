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
        client.logger.info(`${queue.guild.name}(ID: ${queue.guild.id})のキューが破壊されました`);
        client.user.setActivity(`${process.env.PREFIX}help`, { type: 'LISTENING' });
        await queue.data.channel.send(`${formatEmoji(emojis.donatu)}再生を停止してVCから退出しました`);

        if (queue.data.playMsg) {
            await queue.data.playMsg.delete();
        }

        queue.data.playMsg = null;
    }
    catch (error) {
        errorLog(client, error);
    }
};
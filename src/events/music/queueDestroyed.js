const { Queue } = require('discord-music-player');
const { ErrorLog } = require('../../functions/Error');
const MusicBot = require('../../MusicBot');

/**
 * @param {MusicBot} client
 * @param {Queue} queue
 */
module.exports = async (client, queue) => {
    try {
        client.logger.info(`${queue.guild.name}(ID: ${queue.guild.id})のキューが破壊されました`);
        client.user.setActivity(`${process.env.PREFIX}help おうち鯖`, { type: 'LISTENING' });
        await queue.data.channel.send('再生を停止してVCから退出しました');
    }
    catch (error) {
        ErrorLog(client, error);
    }
};
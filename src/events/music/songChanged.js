const { Song, Queue, RepeatMode } = require('discord-music-player');
const MusicBot = require('../../MusicBot');
const { errorLog } = require('../../functions/error');
const { MessageEmbed } = require('discord.js');

/**
 * @param {MusicBot} client
 * @param {Queue} queue
 * @param {Song} newSong
 * @param {Song} oldSong
 */
module.exports = async (client, queue, newSong, oldSong) => {
    try {
        client.logger.info(`${oldSong.name} ${oldSong.url} の再生が終了しました`);
        client.logger.info(`${newSong.name} ${newSong.url} の再生を開始しましました`);

        /*
        if (newSong.milliseconds >= 3600000) {
            queue.skip();
            await queue.data.channel.send('曲が一時間を超えていたためスキップされました');
            if (queue.data.playMsg) await queue.data.playMsg.delete();
            return;
        }
        */

        const msg = await queue.data.channel.send({
            embeds: [
                new MessageEmbed()
                    .setAuthor({ name: 'NowPlaying♪', iconURL: 'https://media.discordapp.net/attachments/876114531418529793/886900601164795914/outimusic.gif' })
                    .addField('タイトル', newSong.name)
                    .addField('チャンネル名', newSong.author)
                    .addField('曲の長さ', newSong.duration)
                    .setURL(newSong.url)
                    .setImage(newSong.thumbnail)
                    .setColor('RANDOM')
                    .setTimestamp(),
            ],
        });

        client.user.setActivity(newSong.name, { type: 'LISTENING' });
        if (queue.data.playMsg) await queue.data.playMsg.delete();
        queue.data.playMsg = msg;

        if (queue.data.skipLoop) {
            queue.setRepeatMode(RepeatMode.SONG);
            queue.data.skipLoop = false;
        }
    }
    catch (error) {
        errorLog(client, error);
    }
};
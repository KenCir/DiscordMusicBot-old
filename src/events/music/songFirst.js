const { Song, Queue } = require('discord-music-player');
const MusicBot = require('../../MusicBot');
const { ErrorLog } = require('../../functions/Error');
const { MessageEmbed } = require('discord.js');

/**
 * @param {MusicBot} client
 * @param {Queue} queue
 * @param {Song} newSong
 */
module.exports = async (client, queue, newSong) => {
    try {
        client.logger.info(`${newSong.name} ${newSong.url} の再生を開始しましました`);
        const msg = await queue.data.channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle('NowPlaying♪')
                    .setURL(newSong.url)
                    .addField('タイトル', newSong.name)
                    .addField('チャンネル名', newSong.author)
                    .addField('曲の長さ', newSong.duration)
                    .setImage(newSong.thumbnail)
                    .setColor('RANDOM')
                    .setTimestamp(),
            ],
        });
        client.startmsgs.set(queue.guild.id, msg.id);
        client.user.setActivity(newSong.name, { type: 'LISTENING' });
    }
    catch (error) {
        ErrorLog(client, error);
    }
};
const { Song, Queue } = require('discord-music-player');
const MusicBot = require('../../MusicBot');
const { ErrorLog } = require('../../functions/Error');
const { MessageEmbed } = require('discord.js');
const { hyperlink } = require('@discordjs/builders');

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
        const msg = await queue.data.channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle('NowPlaying♪')
                    .addField('タイトル', newSong.name)
                    .addField('チャンネル名', newSong.author)
                    .addField('曲の長さ', newSong.duration)
                    .addField('URL', newSong.url)
                    .setImage(newSong.thumbnail)
                    .setColor('RANDOM')
                    .setTimestamp(),
            ],
        });
        client.user.setActivity(newSong.name, { type: 'LISTENING' });
        if (client.startmsgs.get(queue.guild.id)) await queue.data.channel.messages.cache.get(client.startmsgs.get(queue.guild.id)).delete();
        client.startmsgs.set(queue.guild.id, msg.id);
    }
    catch (error) {
        ErrorLog(client, error);
    }
};
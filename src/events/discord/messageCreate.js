const { Message, ClientUser } = require('discord.js');
const { ErrorLog } = require('../../functions/Error');
const MusicBot = require('../../MusicBot');

/**
 * @param {MusicBot} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    try {
        if (message.author.bot || !message.guild || message.system) return;
        if (!message.content.startsWith(process.env.PREFIX)) return;
        const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        if (!command) return;
        // eslint-disable-next-line no-shadow
        const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.info.aliases && cmd.info.aliases.includes(command));
        const queue = client.player.getQueue(message.guildId);
        if (!cmd) return;
        if (cmd.info.category === 'owner' && message.author.id !== process.env.OWNERID) return await message.reply('このコマンドを使用できるのは、Bot管理者のみです');
        if (cmd.info.category === 'admin' && message.member.permissions.has('ADMINISTRATOR')) return await message.reply('このコマンドを使用できるのは、管理者権限所持者のみです');
        if (cmd.info.isPlayed && !queue?.isPlaying) return await message.reply('このコマンドは、曲が再生中の時に使用できます');
        if (cmd.info.isVoiceConnected && ((!queue && !message.member.voice.channel) || (queue && queue.connection.channel.id !== message.member.voice.channelId))) return await message.reply('このコマンドは、Botと同じボイスチャンネルに接続している時に使用できます');
        cmd.run_message(client, message, args);
        client.logger.info(`コマンド実行\nコマンド実行者: ${message.author.tag}(ID: ${message.author.id})\nコマンド: ${cmd.info.name}\nコマンド実行チャンネル: ${message.channel.name}(ID: ${message.channelId})\n引数:\n${args.join('\n')}`);
    }
    catch (error) {
        ErrorLog(client, error);
    }
};
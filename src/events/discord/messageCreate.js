const { Message, ClientUser } = require('discord.js');
const { errorLog } = require('../../functions/error');
const MusicBot = require('../../MusicBot');
const emojis = require('../../../dat/emojis.json');
const { formatEmoji } = require('@discordjs/builders');

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
        if (cmd.info.category === 'owner' && message.author.id !== process.env.OWNERID) return await message.reply(`${formatEmoji(emojis.owox)}このコマンドを使用できるのは、Bot管理者のみです`);
        if (cmd.info.category === 'admin' && message.member.permissions.has('ADMINISTRATOR')) return await message.reply(`${formatEmoji(emojis.owox)}このコマンドを使用できるのは、管理者権限所持者のみです`);
        if (cmd.info.isPlayed && !queue?.isPlaying) return await message.reply(`${formatEmoji(emojis.owox)}このコマンドは、曲が再生中の時に使用できます`);
        if (cmd.info.isVoiceConnected && ((!queue && !message.member.voice.channel) || (queue && queue.connection.channel.id !== message.member.voice.channelId))) return await message.reply(`${formatEmoji(emojis.owox)}このコマンドは、Botと同じボイスチャンネルに接続している時に使用できます`);
        cmd.run_message(client, message, args);
    }
    catch (error) {
        errorLog(client, error);
    }
};
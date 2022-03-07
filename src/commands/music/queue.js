const { SlashCommandBuilder, hyperlink, bold } = require('@discordjs/builders');
const { Queue, RepeatMode } = require('discord-music-player');
const { CommandInteraction, Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { commandError_Message } = require('../../functions/error');
const MusicBot = require('../../MusicBot');

module.exports = {
    info: {
        name: 'queue',
        description: 'キューを表示する',
        usage: 'queue',
        aliases: ['q'],
        category: 'music',
        isPlayed: false,
        isVoiceConnected: false,
    },

    data: new SlashCommandBuilder(),

    /**
     * @param {MusicBot} client
     * @param {CommandInteraction} interaction
     */
    // eslint-disable-next-line no-empty-function
    run: async function (client, interaction) {
    },

    /**
     * @param {MusicBot} client
     * @param {Message} message
     * @param {string[]} args
     */
    run_message: async function (client, message, args) {
        try {
            const queue = client.player.getQueue(message.guildId);
            if (!queue || queue.songs.length < 1) return await message.reply('キューは空です');
            const embeds = [];
            let page = 1;
            let pending = 1;
            for (let i = 0; i < queue.songs.length; i += 10) {
                embeds.push(
                    new MessageEmbed()
                        .setTitle(`${message.guild.name}のキュー ${page}ページ目`)
                        .setDescription(`${bold('NowPlaying♪')}\n${hyperlink(queue.nowPlaying.name, queue.nowPlaying.url)}\n${queue.createProgressBar().prettier}\n\n${bold('次に再生される曲')}\n${queue.songs.slice(i === 0 ? 1 : i, i === 0 ? 11 : i + 10).map(song => `${pending++}: ${hyperlink(song.name, song.url)}`).join('\n')}`)
                        .setImage(queue.nowPlaying.thumbnail)
                        .setColor('RANDOM')
                        .setFooter(`${page++}/${Math.ceil(queue.songs.length / 10)}ページを表示中 | リピートモード: ${queue.repeatMode === RepeatMode.DISABLED ? 'オフ' : queue.repeatMode === RepeatMode.SONG ? '再生中の曲' : 'キュー全体'}`, message.guild.iconURL({ format: 'webp' }))
                        .setTimestamp(),
                );
            }

            if (embeds.length < 2) {
                return await message.reply({
                    embeds: [embeds[0]],
                });
            }

            const buttons = new MessageActionRow()
                .addComponents(
                    [
                        new MessageButton()
                            .setCustomId('left')
                            .setLabel('◀️')
                            .setStyle('PRIMARY')
                            .setDisabled(),
                        new MessageButton()
                            .setCustomId('right')
                            .setLabel('▶️')
                            .setStyle('PRIMARY'),
                        new MessageButton()
                            .setCustomId('stop')
                            .setLabel('⏹️')
                            .setStyle('DANGER'),
                    ],
                );
            const msg = await message.reply({
                embeds: [embeds[0]],
                components: [buttons],
                fetchReply: true,
            });
            let select = 0;
            const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON' });
            collector.on('collect', async i => {
                try {
                    if (i.user.id !== message.author.id) return;
                    if (i.customId === 'left') {
                        select--;
                        buttons.components[1].setDisabled(false);
                        if (select < 1) {
                            buttons.components[0].setDisabled();
                        }
                        await i.update(
                            {
                                embeds: [embeds[select]],
                                components: [buttons],
                            },
                        );
                    }
                    else if (i.customId === 'right') {
                        select++;
                        buttons.components[0].setDisabled(false);
                        if (select >= embeds.length - 1) {
                            buttons.components[1].setDisabled();
                        }
                        await i.update(
                            {
                                embeds: [embeds[select]],
                                components: [buttons],
                            },
                        );
                    }
                    else if (i.customId === 'stop') {
                        buttons.components[0].setDisabled();
                        buttons.components[1].setDisabled();
                        buttons.components[2].setDisabled();
                        await i.update(
                            {
                                embeds: [embeds[select]],
                                components: [buttons],
                            },
                        );
                        collector.stop();
                    }
                }
                catch (error) {
                    commandError_Message(client, message, error);
                }
            });
        }
        catch (error) {
            commandError_Message(client, message, error);
        }
    },
};
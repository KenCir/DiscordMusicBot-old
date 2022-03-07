const { SlashCommandBuilder, userMention, codeBlock } = require('@discordjs/builders');
const { CommandInteraction, Message, MessageEmbed, MessageActionRow, MessageButton, InteractionCollector } = require('discord.js');
const { commandError_Message } = require('../../functions/error');
const MusicBot = require('../../MusicBot');

module.exports = {
    info: {
        name: 'help',
        description: 'このBotのhelp',
        usage: 'help (コマンド名)',
        aliases: [],
        category: 'main',
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
            if (!args[0]) {
                const main = client.commands.filter(x => x.info.category == 'main').map((x) => '`' + x.info.name + '`').join(', ');
                const music = client.commands.filter(x => x.info.category == 'music').map((x) => '`' + x.info.name + '`').join(', ');
                const owner = client.commands.filter(x => x.info.category == 'owner').map((x) => '`' + x.info.name + '`').join(', ');
                const embeds = [];
                embeds.push(
                    new MessageEmbed()
                        .setTitle(`${client.user.tag} helpページ`)
                        .setDescription(`このBotが対応しているサイトはYoutube・Youtube Music・Apple Musicです\nSpotify・SoundCloudは${userMention('778202187314364427')}が対応しています\n\n[] - コマンド必須引数\n() - コマンドオプション引数`)
                        .addField('メインコマンド', main)
                        .addField('ミュージックコマンド', music)
                        .setColor('RANDOM')
                        .setTimestamp(),
                );
                embeds.push(
                    new MessageEmbed()
                        .setTitle('メインコマンド')
                        .setDescription(codeBlock(client.commands.filter(x => x.info.category == 'main').map((x) => `/${x.info.name} ${x.info.usage}: ${x.info.description}`).join('\n')))
                        .setColor('RANDOM')
                        .setTimestamp(),
                );
                embeds.push(
                    new MessageEmbed()
                        .setTitle('ミュージックコマンド')
                        .setDescription(codeBlock(client.commands.filter(x => x.info.category == 'music').map((x) => `/${x.info.name} ${x.info.usage}: ${x.info.description}`).join('\n')))
                        .setColor('RANDOM')
                        .setTimestamp(),
                );
                if (message.author.id === process.env.OWNERID) {
                    embeds[0].addField('BotOwnerコマンド', owner);
                    embeds.push(
                        new MessageEmbed()
                            .setTitle('BotOwnerコマンド')
                            .setDescription(codeBlock(client.commands.filter(x => x.info.category == 'owner').map((x) => `/${x.info.name} ${x.info.usage}: ${x.info.description}`).join('\n')))
                            .setColor('RANDOM')
                            .setTimestamp(),
                    );
                }

                let select = 0;
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

                const msg = await message.reply(
                    {
                        embeds: [embeds[0]],
                        components: [
                            buttons,
                        ],
                        fetchReply: true,
                    },
                );

                const filter = (i) => i.user.id === message.author.id;
                const collector = new InteractionCollector(client, { filter: filter, componentType: 'BUTTON', message: msg });
                collector.on('collect', async i => {
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
                });
            }
            else {
                const command = client.commands.get(args[0]) || client.commands.find(x => x.info.aliases.includes(args[0]));
                if (!command) return await message.reply('そのコマンドは存在しません');
                await message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`コマンド名: ${command.info.name}`)
                            .setDescription(`コマンド名: ${command.info.name}\n説明: ${command.info.description}\nコマンドカテゴリ: ${command.info.category}`)
                            .setColor('RANDOM')
                            .setTimestamp(),
                    ],
                });
            }
        }
        catch (error) {
            commandError_Message(client, message, error);
        }
    },
};
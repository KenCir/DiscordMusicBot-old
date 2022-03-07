const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { CommandInteraction, Message, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const { inspect } = require('util');
const { commandError_Message } = require('../../functions/error');
const MusicBot = require('../../MusicBot');

module.exports = {
    info: {
        name: 'eval',
        description: '簡易プログラム実行',
        usage: 'eval [code...]',
        aliases: [],
        category: 'owner',
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
            if (args.length < 1) return await message.reply('評価するコードを引数に入れてください');

            const buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('ok')
                        .setEmoji('881574101041442887')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('no')
                        .setEmoji('881574101444083742')
                        .setStyle('PRIMARY'),
                );

            const msg = await message.reply({
                content: `${codeBlock('以下のコードを実行してもいいですか？\n実行していい場合はokを、キャンセルする場合はnoボタンを押してください\n30秒経つと強制キャンセルされます')}${codeBlock('js', args.join(' '))}`,
                components: [buttons],
            });
            const filter = (i) => (i.customId === 'ok' || i.customId === 'no') && i.user.id === message.author.id;
            const response2 = await msg.awaitMessageComponent({ filter, componentType: 'BUTTON', max: 1, time: 60000 });
            if (!response2) { return await msg.delete(); }
            else if (response2.customId === 'no') { return await msg.delete(); }
            else if (response2.customId === 'ok') {
                let evaled;
                try {
                    evaled = await eval(args.join(' '));
                    const evalinspect = inspect(evaled);
                    if (evalinspect.length <= 2000) {
                        await response2.update({
                            content: codeBlock(evalinspect),
                            components: [],
                        });
                    }
                    else {
                        await response2.update({
                            content: '実行結果が2000文字を超えているためファイル出力しました',
                            components: [],
                            attachments: [
                                new MessageAttachment(inspect(evaled), 'evaled.txt'),
                            ],
                        });
                    }
                }
                catch (error) {
                    await response2.update(
                        {
                            content: `ERROR!\n${codeBlock(error.stack)}`,
                            components: [],
                        },
                    );
                }
            }
        }
        catch (error) {
            commandError_Message(client, message, error);
        }
    },
};
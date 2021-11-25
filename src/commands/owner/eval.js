const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { CommandInteraction, Message, MessageActionRow, MessageButton } = require('discord.js');
const { inspect } = require('util');
const { CommandError_Message } = require('../../functions/Error');
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
                        .setEmoji('810436146718441483')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('no')
                        .setEmoji('810436146978619392')
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
                            content: '実行結果が2000文字を超えているため送信出来ません',
                            components: [],
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
            CommandError_Message(client, message, error);
        }
    },
};
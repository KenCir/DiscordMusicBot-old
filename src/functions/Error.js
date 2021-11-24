const { codeBlock, userMention } = require('@discordjs/builders');
const { CommandInteraction, WebhookClient, MessageEmbed, Message } = require('discord.js');
const MusicBot = require('../MusicBot');

module.exports = {

    /**
     * コマンドエラー出力用
     * @param {MusicBot} client
     * @param {CommandInteraction} interaction
     * @param {Error} error
     */

    CommandError: async function (client, interaction, error) {
        client.logger.error(error.stack);
        try {
            if (!client.isReady()) return;
            const webhook = new WebhookClient({ url: process.env.ERROR_WEBHOOK_URL });
            webhook.send({
                content: codeBlock(error.stack),
                avatarURL: client.user.avatarURL({ format: 'webp' }),
                username: `${client.user.username}-エラーログ`,
            }).catch(client.logger.error);

            await interaction.followUp(`コマンド実行中にエラーが発生しました\n${error.name}\n${error.message}`);
        }
        catch (err) {
            client.logger.error(err.stack);
        }
    },

    /**
     * コマンドエラー出力用 Messageバージョン
     * @param {MusicBot} client
     * @param {Message} message
     * @param {Error} error
     */

    CommandError_Message: async function (client, message, error) {
        try {
            // 出力する必要のないエラーは省略
            if (error.message === 'Collector received no interactions before ending with reason: time') return;
            client.logger.error(error.stack);
            if (!client.isReady()) return;
            const webhook = new WebhookClient({ url: process.env.ERROR_WEBHOOK_URL });
            webhook.send({
                content: `${userMention(process.env.OWNERID)}\n${codeBlock(error.stack)}`,
                avatarURL: client.user.avatarURL({ format: 'webp' }),
                username: `${client.user.username}-エラーログ`,
            }).catch(client.logger.error);

            await message.reply(`コマンド実行中にエラーが発生しました\n${error.name}\n${error.message}`);
        }
        catch (err) {
            client.logger.error(err.stack);
        }
    },

    /**
     * コマンド以外のエラー出力用
     * @param {MusicBot} client
     * @param {Error} error
     */

    ErrorLog: async function (client, error) {
        client.logger.error(error.stack);
        try {
            if (!client.isReady()) return;
            if (error.message === 'Collector received no interactions before ending with reason: time') return;
            const webhook = new WebhookClient({ url: process.env.ERROR_WEBHOOK_URL });
            await webhook.send({
                content: `${userMention(process.env.OWNERID)}\n${codeBlock(error.stack)}`,
                avatarURL: client.user.avatarURL({ format: 'webp' }),
                username: `${client.user.username}-エラーログ`,
            });
        }
        catch (err) {
            client.logger.error(err.stack);
        }
    },
};
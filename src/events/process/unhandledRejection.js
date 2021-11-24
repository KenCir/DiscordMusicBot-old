const { codeBlock, userMention } = require('@discordjs/builders');
const { WebhookClient } = require('discord.js');
const MusicBot = require('../../MusicBot');

/**
 * @param {MusicBot} client
 * @param {Error} reason
 * @param {Promise} promise
 */

module.exports = async (client, reason, promise) => {
    client.logger.error(reason);
    try {
        if (!client.isReady()) return;
        if (reason.message === 'Collector received no interactions before ending with reason: time') return;
        const webhook = new WebhookClient({ url: process.env.ERROR_WEBHOOK_URL });
        await webhook.send({
            content: `${userMention(process.env.OWNERID)}catchされない例外が発生しました\n${codeBlock(reason.stack)}`,
            avatarURL: client.user.avatarURL({ format: 'webp' }),
            username: `${client.user.username}-エラーログ`,
        });
    }
    catch (error) {
        client.logger.error(error);
    }
};
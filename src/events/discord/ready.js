const { ErrorLog } = require('../../functions/Error');
const MusicBot = require('../../MusicBot');

/**
 * @param {MusicBot} client
 */

module.exports = async (client) => {
    try {
        client.logger.info(`Logged in as ${client.user.tag}`);
        client.user.setActivity(`${process.env.PREFIX}help`, { type: 'LISTENING' });
    }
    catch (error) {
        ErrorLog(client, error);
    }
};
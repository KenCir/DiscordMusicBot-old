const MusicBot = require('../../MusicBot');
const { shutdown } = require('log4js');

/**
 * @param {MusicBot} client
 * @param {number} code
 */

module.exports = (client, code) => {
    try {
        client.destroy();
        // client.db.close();
        shutdown();
    }
    catch (error) {
        client.logger.error(error);
    }
};
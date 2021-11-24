const MusicBot = require('../../MusicBot');

/**
 * プログラムが終了される時に呼び出されるらしい
 * @param {MusicBot} client
 */

module.exports = (client) => {
    try {
        process.exit();
    }
    catch (error) {
        client.logger.error(error);
    }
};
const { Player } = require('discord-music-player');
const { Client, ClientOptions, Collection, CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getLogger, configure } = require('log4js');
configure({
    appenders: {
        out: { type: 'stdout', layout: { type: 'coloured' } },
        app: { type: 'file', filename: 'logs/musicbot.log', pattern: 'yyyy-MM-dd.log' },
    },
    categories: {
        default: { appenders: ['out', 'app'], level: 'all' },
    },
});

class MusicBot extends Client {
    /**
     * @param {ClientOptions} options
     */
    constructor(options) {
        super(options);

        this.player = new Player(this, {
            leaveOnEmpty: false,
            leaveOnEnd: false,
            leaveOnStop: false,
            deafenOnJoin: true,
        });

        this.logger = getLogger('MusicBot');

        /**
         * @type {Collection<string, { info: { name: string, description: string, usage: string, aliases: string[], category: 'main' | 'music' | 'dj' | 'admin' | 'owner', isPlayed: boolean, isVoiceConnected: boolean }, data: SlashCommandBuilder, run: function(MusicBot, CommandInteraction): Promise<void>, run_message: function(MusicBot, Message, string[]): Promise<void> }>}
         */
        this.commands = new Collection();

        /**
         * @type {Collection<string, string>}
         */
        this.startmsgs = new Collection();
    }
}

module.exports = MusicBot;
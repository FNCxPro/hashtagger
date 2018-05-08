const { RichEmbed } = require('discord.js')
const { Command } = require('discord.js-commando')
const sr = require('common-tags').stripIndents
const config = require('config')
const os = require('os')
module.exports = class InfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'info',
      group: 'util',
      memberName: 'info',
      description: 'Display info about the bot',
      details: sr`Display some in-depth info about the bot.`,
      examples: ['info'],
      ownerOnly: false
    })
  }
  async run(msg, args) {
    let embed = new RichEmbed()
      .setTitle('ℹ `Information`')
      .addField('Library', 'discord.js', true)
      .addField('Language', '[node.js](https://nodejs.org)', true)
      .addField('Version', require('../../package.json').version, true)
      .addField('Node Version', process.version, true)
      .addField('Hostname', os.hostname(), true)
      .addField('Platform', os.platform(), true)
      .addField('Environment', process.env.NODE_ENV || '*This bot is running insecurely, please notify the maintainer*', true)
      .addField('Maintainer', `<@${config.get('bot.owner')}>`, true)
      .setTimestamp()
      .setColor(config.get('colors.blue'))
      .setImage(msg.client.user.displayAvatarURL)
    return await msg.channel.send({
      embed
    })
  }
}
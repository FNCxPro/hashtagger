const { RichEmbed } = require('discord.js')
const { Command } = require('discord.js-commando')
const sr = require('common-tags').stripIndents
const config = require('config')
module.exports = class SupportCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'support',
      group: 'util',
      memberName: 'support',
      description: 'Get support for the bot',
      details: sr`Display the invite link to the bot support server`,
      examples: ['support'],
      ownerOnly: false
    })
  }
  async run(msg, args) {
    return await msg.channel.send(config.get('bot.invite'))
  }
}
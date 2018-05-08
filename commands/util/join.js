const { RichEmbed } = require('discord.js')
const { Command } = require('discord.js-commando')
const config = require('config')
module.exports = class JoinCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'join',
      group: 'util',
      memberName: 'join',
      description: 'Get the bot to join your server',
      details: sr`Display the join link to make the bot join your server`,
      examples: ['join'],
      ownerOnly: false
    })
  }
  async run(msg, args) {
    return await msg.channel.send(`https://discordapp.com/api/oauth2/authorize?client_id=${config.get('bot.clientId')}&permissions=${config.get('bot.permissions')}&scope=bot`)
  }
}
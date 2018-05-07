const Commando = require('discord.js-commando'),
      Discord = require('discord.js'),
      config = require('config'),
      log = require('./logger'),
      path = require('path')

const client = new Commando.CommandoClient({
  owner: config.get('bot.owner'),
  commandPrefix: config.get('bot.prefix')
})

client.on('ready', () => {
  log.info(`${client.user.username} is ready on ${client.guilds.size} servers and ${client.channels.size} channels.`)
})

client.registry
  .registerGroup('config', '🔧 Configuration')

  // Register default commands from discord.js-commando
  .registerDefaults()

  // Register all commands in ./commands directory
  .registerCommandsIn(path.join(__dirname, 'commands'))

// Login using the token provided in the configuration
client.login(config.get('bot.token'))
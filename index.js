const Commando = require('discord.js-commando'),
      Sequelize = require('sequelize'),
      Discord = require('discord.js'),
      config = require('config'),
      log = require('./logger'),
      path = require('path')

const client = new Commando.CommandoClient({
  owner: config.get('bot.owner'),
  commandPrefix: config.get('bot.prefix')
})

const database = require('./models')

client.on('ready', () => {
  log.info(`${client.user.username} is ready on ${client.guilds.size} servers and ${client.channels.size} channels.`)
})

client.on('message', async (message) => {
  if (message.channel.type !== 'dm' && message.guild) {
    let guild = message.guild
    // Find or create the guild in the database. It won't be used after it's found however.
    // TODO: see about optimization
    let dguild = await database.Server.findOrCreate({
      where: {
        id: guild.id
      }
    })
  }
})

client.registry
  .registerGroup('config', '🔧 Configuration')

  // Register default commands from discord.js-commando
  .registerDefaults()

  // Register all commands in ./commands directory
  .registerCommandsIn(path.join(__dirname, 'commands'))

// Login using the token provided in the configuration
client.login(config.get('bot.token'))
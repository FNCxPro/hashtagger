const Commando = require('discord.js-commando'),
      Sequelize = require('sequelize'),
      Discord = require('discord.js'),
      config = require('config'),
      moment = require('moment'),
      log = require('./logger'),
      path = require('path')

const client = new Commando.CommandoClient({
  owner: config.get('bot.owner'),
  commandPrefix: config.get('bot.prefix'),
  disableEveryone: true // Don't want people hashtagging and using @everyone :(
})

const db = require('./models')

client.on('ready', () => {
  log.info(`${client.user.username} is ready on ${client.guilds.size} servers and ${client.channels.size} channels.`)
})

client.on('message', async (message) => {
  if (message.channel.type !== 'dm' && message.guild) {
    if (message.author.bot) return // Ignore bots
    let guild = message.guild
    // Find or create the guild in the database. I lied, it will be used to see if the server was setup for a hashtag yet.
    // TODO: see about optimization
    let _dguild = await db.Server.findOrCreate({
      where: {
        id: guild.id
      }
    })
    let dguild = _dguild[0]
    try {
      if (dguild.setup) {
        let content = message.cleanContent
        let matches = content.match(/#([A-Za-z0-9]+)/gi)
        if (!matches) return
        let wotags = matches.map((x) => x.substr(1))
        wotags.forEach(async (ht) => {
          let quote = new Discord.RichEmbed()
            .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL) // Set embed author to the author of the quote
            .setTimestamp(moment(message.createdTimestamp).toISOString()) // Set embed timestamp to when the message was authored
            .setColor(config.get('colors.blue')) // Set the embed color to a blue color defined in the config.
            .setDescription(content.replace(`#${ht}`, `**#${ht}**`)) // Replace the hashtag occurance in the message with a bold one. (TODO: may want to make it actually replace the one that it found, may bug out once in a while)
          if (dguild.hashtags && dguild.hashtags[ht]) {
            let htchan = guild.channels.get(dguild.hashtags[ht])
            if (htchan) htchan.send({embed: quote})
          } else {
            if (guild.channels.find('name', ht)) return // Prevent people from making hashtags that already exist or hashtags with the same name as a channel that already exists
            let newChan = await guild.createChannel(ht, 'text', [{
              id: guild.id,
              deny: ['SEND_MESSAGES'] // Deny @everyone to send messages in new channel
            }, {
              id: client.user.id,
              allow: ['SEND_MESSAGES'] // Allow bot to send messages in new channel
            }])
            await dguild.update({
              hashtags: Object.assign(dguild.hashtags || {}, {
                [ht]: newChan.id
              })
            })
            await newChan.setParent(dguild.hashtagCategory)
            quote.setFooter('This is the first occurance of the hashtag in the server!')
            let quoteMsg = await newChan.send({embed: quote})
            await quoteMsg.pin()
          }
        })
      }
    } catch(err) {
      log.error('Failed to do something in message handler')
      log.error(err)
    }
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

process.on('unhandledRejection', (err) => console.error(err))
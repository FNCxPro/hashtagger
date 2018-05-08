const { RichEmbed, Util } = require('discord.js')
const { Command } = require('discord.js-commando')
const config = require('config')
const sr = require('common-tags').stripIndents
const db = require('../../models')
const log = require('../../logger')
module.exports = class SetupCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setup',
      group: 'config',
      memberName: 'setup',
      description: 'Setup your server to start parsing hashtags',
      details: sr`This command will setup your server to start parsing hashtags.
      It will create a hashtags category in your server.`,
      examples: ['setup'],
      guildOnly: true,
      ownerOnly: false
    })
  }
  async run(msg, args) {
    if (!msg.member.hasPermission('MANAGE_GUILD')) {
      return await msg.channel.send({embed: new RichEmbed()
        .setTitle(`${config.get('emoji.cross')} \`Missing Permissions\``)
        .setColor(config.get('colors.red'))
        .setDescription('You require the `Manage Server` permission to execute this command.')})
    }
    let _server = await db.Server.findOrCreate({
      where: {
        id: msg.guild.id
      }
    })
    let server = _server[0]
    if (server.setup) {
      return await msg.channel.send({embed: new RichEmbed()
        .setTitle(`${config.get('emoji.cross')} \`Setup Failed\``)
        .setColor(config.get('colors.red'))
        .setDescription('The setup has already ran for this server. Please run `ht.revert` to revert the setup flag for the server.\n**Command not yet implemented -- it will be at a later date.**')})
    }
    try {
      let category = await msg.guild.createChannel('Hashtags', 'category', [{
        id: msg.guild.id,
        deny: ['SEND_MESSAGES']
      }, {
        id: msg.client.user.id,
        allow: ['SEND_MESSAGES']
      }], `Creation requested by @${msg.author.username}#${msg.author.discriminator}`)
      await server.update({
        setup: true,
        hashtagCategory: category.id
      })
      return await msg.channel.send({
        embed: new RichEmbed()
          .setTitle(`${config.get('emoji.check')} \`Setup Completed\``)
          .setColor(config.get('colors.green'))
          .setDescription('The setup completed successfully. Just write any message and put a hashtag in it and the channel will be created under the Hashtags category.\nYou are free to change the category and move it, but don\'t remove the bot\'s permission to write in it/create channels in the category!\nDefinitely don\'t delete the category either!')
      })
    } catch(err) {
      log.error('Failed to setup server :(')
      log.error(err.stack)
      return await msg.channel.send({embed: new RichEmbed()
        .setTitle(`${config.get('emoji.cross')} \`Setup Failed\``)
        .setColor(config.get('colors.red'))
        .setDescription('Setup encountered an unexpected error.')
        .addField('Message', `\`\`\`${Util.escapeMarkdown(err.message || 'none')}\`\`\``)
        .addField('Stack', `\`\`\`${Util.escapeMarkdown(err.stack)}\`\`\``)
        .addField('Note', 'If this error is about not having enough permissions, the bot requires create channel permissions for the entire server.')
        .addField('⚠ Warning', `Please join [the support server](${config.get('bot.invite')}) and send COPY AND PASTES of the message and stack trace above (and the text below in the footer).\nPlease **DO NOT** send screenshots of this embed.`)
        .setFooter(`hashtagger@${require('../../package.json').version} - ${process.env.NODE_ENV || '*no environment*'}`)
      })
    }
  }
}
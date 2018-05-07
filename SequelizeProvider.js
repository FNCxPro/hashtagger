const { SettingProvider } = require('discord.js-commando')
class SequelizeProvider extends SettingProvider {
  /**
   * @param {*} db - Sequelize connection to use
   */
  constructor(db) {
    //TODO: Make this work
  }
}

module.exports = SequelizeProvider
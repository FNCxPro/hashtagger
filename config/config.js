const config = require('config')

const options = Object.assign({
  username: config.get('database.username'),
  password: config.get('database.password'),
  database: config.get('database.database')
}, config.get('database.sequelize'))

module.exports = {
  development: options,
  test: options,
  production: options
}
//TODO: Probably could be changed above, thanks.
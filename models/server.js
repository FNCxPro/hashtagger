'use strict';
module.exports = (sequelize, DataTypes) => {
  var Server = sequelize.define('Server', {
    hashtagCategory: DataTypes.STRING,
    hashtags: DataTypes.JSON,
    setup: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  Server.associate = function(models) {
    // associations can be defined here
  };
  return Server;
};
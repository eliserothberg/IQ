'use strict';
module.exports = function(sequelize, DataTypes) {
  var Salespeople = sequelize.define('Salespeople', {
    salesName: DataTypes.STRING,
    salesID: DataTypes.STRING

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Salespeople;
};
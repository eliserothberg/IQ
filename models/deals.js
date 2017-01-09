'use strict';

module.exports = function(sequelize, DataTypes) {
  var Deals = sequelize.define('Deals', {
    campaignID: DataTypes.STRING,
    name: DataTypes.STRING,
    dealStatus: DataTypes.STRING,
    salesperson: DataTypes.STRING,
    salesName: DataTypes.STRING,
    revenue: DataTypes.INTEGER,
    month: DataTypes.INTEGER,
    createDate: DataTypes.DATE,
    closeDate: DataTypes.DATE,
    dealType: DataTypes.STRING,
    vertical: DataTypes.STRING,
    newVersusReturning: DataTypes.STRING,
    productLine: DataTypes.STRING,
    country: DataTypes.STRING

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Deals;
};
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Vote extends Model {}

Vote.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    value: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isIn: [[1, -1]],
      },
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    articleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Vote',
    tableName: 'votes',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'article_id'],
      },
    ],
  }
);

module.exports = Vote;

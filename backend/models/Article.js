const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Article extends Model {}

Article.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    categories: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    upVotes: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    downVotes: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    publicationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    authorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Article',
    tableName: 'articles',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Article;

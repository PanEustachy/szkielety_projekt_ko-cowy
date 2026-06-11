const { sequelize, createDatabaseIfNotExists } = require('../config/database');
const User = require('./User');
const Article = require('./Article');
const Vote = require('./Vote');

User.hasMany(Article, { as: 'articles', foreignKey: 'authorId' });
Article.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

User.hasMany(Vote, { as: 'votes', foreignKey: 'userId' });
Vote.belongsTo(User, { foreignKey: 'userId' });

Article.hasMany(Vote, { as: 'votes', foreignKey: 'articleId' });
Vote.belongsTo(Article, { foreignKey: 'articleId' });

module.exports = {
  sequelize,
  createDatabaseIfNotExists,
  User,
  Article,
  Vote,
};

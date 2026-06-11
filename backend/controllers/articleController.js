const { Article, User, Vote } = require('../models');

const listArticles = async (req, res) => {
  const articles = await Article.findAll({
    order: [['publicationDate', 'DESC']],
    include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
  });

  return res.json(
    articles.map((article) => ({
      id: article.id,
      title: article.title,
      content: article.content,
      tags: article.tags ? article.tags.split(',').map((tag) => tag.trim()) : [],
      categories: article.categories ? article.categories.split(',').map((cat) => cat.trim()) : [],
      upVotes: article.upVotes,
      downVotes: article.downVotes,
      publicationDate: article.publicationDate,
      author: article.author ? { id: article.author.id, name: article.author.name } : null,
      authorId: article.authorId,
    }))
  );
};

const getArticle = async (req, res) => {
  const article = await Article.findByPk(req.params.id, {
    include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
  });

  if (!article) {
    return res.status(404).json({ message: 'Artykuł nie istnieje.' });
  }

  let userVote = null;
  if (req.user) {
    const voteRecord = await Vote.findOne({
      where: {
        articleId: article.id,
        userId: req.user.id,
      },
    });
    if (voteRecord) {
      userVote = voteRecord.value;
    }
  }

  return res.json({
    id: article.id,
    title: article.title,
    content: article.content,
    tags: article.tags ? article.tags.split(',').map((tag) => tag.trim()) : [],
    categories: article.categories ? article.categories.split(',').map((cat) => cat.trim()) : [],
    upVotes: article.upVotes,
    downVotes: article.downVotes,
    publicationDate: article.publicationDate,
    author: article.author ? { id: article.author.id, name: article.author.name } : null,
    authorId: article.authorId,
    userVote,
  });
};

const createArticle = async (req, res) => {
  const { title, content, tags, categories } = req.body;

  const article = await Article.create({
    title,
    content,
    tags: tags ? tags.join(',') : null,
    categories: categories ? categories.join(',') : null,
    authorId: req.user.id,
    publicationDate: new Date(),
  });

  return res.status(201).json(article);
};

const updateArticle = async (req, res) => {
  const { title, content, tags, categories } = req.body;
  const article = req.article;

  article.title = title;
  article.content = content;
  article.tags = tags ? tags.join(',') : null;
  article.categories = categories ? categories.join(',') : null;
  await article.save();

  return res.json(article);
};

const deleteArticle = async (req, res) => {
  await req.article.destroy();
  return res.json({ message: 'Artykuł został usunięty.' });
};

const rateArticle = async (req, res) => {
  const article = await Article.findByPk(req.params.id);
  if (!article) {
    return res.status(404).json({ message: 'Artykuł nie istnieje.' });
  }

  const existingVote = await Vote.findOne({
    where: {
      articleId: article.id,
      userId: req.user.id,
    },
  });

  if (existingVote) {
    return res.status(400).json({ message: 'Możesz oddać głos tylko raz na ten artykuł.' });
  }

  const { vote } = req.body;
  if (![1, -1].includes(vote)) {
    return res.status(400).json({ message: 'Nieprawidłowa ocena.' });
  }

  if (vote === 1) {
    article.upVotes += 1;
  } else {
    article.downVotes += 1;
  }

  await article.save();
  await Vote.create({
    articleId: article.id,
    userId: req.user.id,
    value: vote,
  });

  return res.json({ upVotes: article.upVotes, downVotes: article.downVotes });
};

module.exports = {
  listArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  rateArticle,
};

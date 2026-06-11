const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Brak uwierzytelnienia.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Brak wymaganych uprawnień.' });
    }

    next();
  };
};

const authorizeArticleOwnership = async (req, res, next) => {
  const { Article } = require('../models');
  const article = await Article.findByPk(req.params.id);
  if (!article) {
    return res.status(404).json({ message: 'Artykuł nie znaleziony.' });
  }

  if (req.user.role === 'admin' || article.authorId === req.user.id) {
    req.article = article;
    return next();
  }

  return res.status(403).json({ message: 'Brak uprawnień do modyfikacji artykułu.' });
};

module.exports = {
  authorizeRole,
  authorizeArticleOwnership,
};

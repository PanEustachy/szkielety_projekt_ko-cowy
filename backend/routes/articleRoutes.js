const express = require('express');
const { body } = require('express-validator');
const {
  listArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  rateArticle,
} = require('../controllers/articleController');
const authenticate = require('../middlewares/authMiddleware');
const optionalAuthenticate = require('../middlewares/optionalAuthMiddleware');
const { authorizeRole, authorizeArticleOwnership } = require('../middlewares/rolesMiddleware');
const validateRequest = require('../middlewares/validationMiddleware');

const router = express.Router();

router.get('/', listArticles);
router.get('/:id', optionalAuthenticate, getArticle);

router.post(
  '/',
  authenticate,
  authorizeRole(['admin', 'editor']),
  [
    body('title').trim().notEmpty().withMessage('Tytuł jest wymagany.'),
    body('content').trim().notEmpty().withMessage('Treść jest wymagana.'),
  ],
  validateRequest,
  createArticle
);

router.put(
  '/:id',
  authenticate,
  authorizeArticleOwnership,
  [
    body('title').trim().notEmpty().withMessage('Tytuł jest wymagany.'),
    body('content').trim().notEmpty().withMessage('Treść jest wymagana.'),
  ],
  validateRequest,
  updateArticle
);

router.delete('/:id', authenticate, authorizeArticleOwnership, deleteArticle);
router.post(
  '/:id/rate',
  authenticate,
  [body('vote').isIn([1, -1]).withMessage('Ocena musi być 1 lub -1.')],
  validateRequest,
  rateArticle
);

module.exports = router;

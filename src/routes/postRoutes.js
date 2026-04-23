const express = require('express');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const {
    createComment,
    getCommentsByPost,
} = require('../controllers/postController');
const auth = require('../middleware/auth');

const router = express.Router();

// Publiques
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protégées
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

router.get ('/:postId/comments', getCommentsByPost);
router.post('/:postId/comments', auth, createComment);

module.exports = router;
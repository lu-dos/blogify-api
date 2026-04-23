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

const { toggleLike, getLikesByPost } = require('../controllers/likeController');

const router = express.Router();

// Publiques
router.get('/', getPosts);
router.get('/:id', getPostById);
router.get('/:postId/comments', getCommentsByPost);
router.get('/:postId/likes', getLikesByPost);

// Protégées
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:postId/comments', auth, createComment);
router.post('/:postId/like', auth, toggleLike);

module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const {
  createComment,
  getCommentsByPost,
} = require("../controllers/commentController");

const { toggleLike, getLikesByPost } = require("../controllers/likeController");

// Routes Publiques
router.get("/", getPosts);
router.get("/:id", getPostById);

router.get("/:postId/comments", getCommentsByPost);
router.get("/:postId/likes", getLikesByPost);

// Routes Protégées (authentification requise)
router.post("/", auth, createPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

router.post("/:postId/comments", auth, createComment);

router.post("/:postId/like", auth, toggleLike);

module.exports = router;

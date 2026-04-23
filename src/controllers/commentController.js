const Comment = require('../models/Comment');
const Post = require('../models/Post');

// POST /posts/:postId/comments
const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Contenu requis' });

    const post = await Post.findById(req.params.postId);
    if (!post || post.status === 'deleted') {
      return res.status(404).json({ message: 'Article introuvable' });
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: req.params.postId,
    });
    res.status(201).json({ message: 'Commentaire ajouté', comment });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /posts/:postId/comments
const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId, status: 'active' })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /comments/:id
const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment || comment.status === 'deleted') {
      return res.status(404).json({ message: 'Commentaire introuvable' });
    }
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { content } = req.body;
    if (content) comment.content = content;
    await comment.save();
    res.status(200).json({ message: 'Commentaire modifié', comment });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /comments/:id (soft delete)
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment || comment.status === 'deleted') {
      return res.status(404).json({ message: 'Commentaire introuvable' });
    }
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    comment.status = 'deleted';
    await comment.save();
    res.status(200).json({ message: 'Commentaire supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { createComment, getCommentsByPost, updateComment, deleteComment };
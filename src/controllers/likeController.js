const like = require('../models/Like');
const Post = require('../models/Post');

// POST /posts/:postId/like
const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post || post.status === 'deleted') {
            return res.status(404).json({ message: 'Article introuvable' });
        }

        const existingLike = await like.findOne({ post: req.params.postId, user: req.user._id });

        if (existingLike) {
            await existingLike.deleteOne();
            return res.status(200).json({ message: 'Like retiré', liked: false });
        } 

        await like.create({user: req.user._id, post: req.params.postId });
        res.status(201).json({ message: 'Like ajouté', liked: true });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
};

//GET /posts/:postId/likes
const getLikesCount = async (req, res) => {
    try {
        const likes = await Like.find({ post: req.params.postId })
        .populate('user', 'username');
        res.status(200).json({ count: likes.length, likes });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
};

module.exports = { toggleLike,getLikesCount};
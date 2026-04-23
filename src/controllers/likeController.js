const Like = require("../models/Like");
const Post = require("../models/Post");

const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post || post.status === "deleted") {
      return res.status(404).json({ message: "Post introuvable" });
    }

    const existingLike = await Like.findOne({
      user: req.user._id,
      post: req.params.postId,
    });

    if (existingLike) {
      await existingLike.deleteOne();
      return res.status(200).json({ message: "Like enlevé" });
    }

    await Like.create({
      user: req.user._id,
      post: req.params.postId,
    });

    res.status(201).json({ message: "Post liké" });
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

const getLikesByPost = async (req, res) => {
  try {
    const likes = await Like.find({ post: req.params.postId }).populate(
      "user",
      "username",
    );

    res.status(200).json({
      count: likes.length,
      likes,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

module.exports = {
  toggleLike,
  getLikesByPost,
};

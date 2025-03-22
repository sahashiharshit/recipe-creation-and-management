import { Follow } from "../models/Follow.js";

export const followUser = async (req, res) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user.id;
    if (followerId === followingId) {
      return res.status(400).json({ error: "You cannot follow yourself!" });
    }
    const existingFollow = await Follow.findOne({
      where: { followerId, followingId },
    });
    if (existingFollow) {
      return res.status(400).json({ error: "Already following this user!" });
    }

    await Follow.create({ followerId, followingId });
    res.status(200).json({ success: true, message: "User followed!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to follow user." });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user.id;

    const follow = await Follow.findOne({
      where: { followerId, followingId },
    });

    if (!follow) {
      return res.status(404).json({ error: "Not following this user!" });
    }

    await follow.destroy();
    res.status(200).json({ success: true, message: "User unfollowed!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to unfollow user." });
  }
};

// ✅ Check if Following
export const checkIfFollowing = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { userId: followingId } = req.params;

    const follow = await Follow.findOne({
      where: { followerId, followingId },
    });

    res.status(200).json({ isFollowing: !!follow });
  } catch (error) {
    res.status(500).json({ error: "Failed to check follow status." });
  }
};

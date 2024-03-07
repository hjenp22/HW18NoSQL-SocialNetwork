const { User, Thought } = require('../models');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find()
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('thoughts')
        .populate('friends');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.userId);

      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      await Thought.deleteMany({ _id: { $in: deletedUser.thoughts } });


      res.json({ message: 'User deleted successfully', deletedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true, runValidators: true });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User updated successfully' });
    } catch (err) {
      console.error(err);

      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation error', errors: err.errors });
      }

      res.status(500).json(err);
    }
  },

  async addFriend(req, res) {
    try {
      const { friend } = req.body;
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: friend } },
        { runValidators: true, new: true }
      ).populate('friends');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
};

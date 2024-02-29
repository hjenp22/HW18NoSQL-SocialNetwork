const { Thought, User } = require('../models');
const ReactionSchema = require('../models/Reaction');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().populate('username');
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .populate('username');

      if (!thought) {
        return res.status(404).json({ message: 'No thought found with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createThought(req, res) {
    console.log('Adding a thought');
    console.log(req.body);

    try {
      const { thoughtText, username, userId } = req.body;

      if (!thoughtText || !username || !userId) {
        return res.status(400).json({ message: 'Invalid request. Please provide thoughtText, username, and userId.' });
      }

      const newThought = await Thought.create({ thoughtText, username });
      console.log('New Thought:', newThought);

      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { thoughts: newThought._id } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user found with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        res.status(404).json({ message: 'No thought found with that ID' });
      }

      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $pull: { thoughts: req.params.thoughtId } },
        { runValidators: true, new: true }
      );

      res.json({ message: 'Thought deleted.' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought found with this ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addReaction(req, res) {
    console.log('Adding a reaction');
    console.log(req.body);

    try {
      const { reactionBody, username, userId } = req.body;

      if (!reactionBody || !username || !userId) {
        return res.status(400).json({ message: 'Invalid request. Please provide reactionBody, username, and userId.' });
      }

      const newReaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      console.log('New Reaction:', newReaction);

      if (!newReaction) {
        return res.status(404).json({ message: 'No thought found with that ID' });
      }

      res.json(newReaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async removeReaction(req, res) {
    console.log("DELETE", req.params);

    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      console.log(thought);

      if (!thought) {
        return res.status(404).json({ message: 'No thought found with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

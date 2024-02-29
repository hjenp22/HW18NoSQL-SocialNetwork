const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
  {
    thoughtText: {
      required: true,
      maxlength: 280,
      minlength: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      default: defaultUsername,
    },
    reactions: [reactionSchema],
    },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

thoughtSchema.virtual('formattedCreatedAt').get(function () {
  const options = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return this.createdAt.toLocaleString('en-US', options);
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;

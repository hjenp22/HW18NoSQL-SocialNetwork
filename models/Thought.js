const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction'); // Importing the reaction schema

// Defining the thought schema
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
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
      required: true,
    },
    reactions: [reactionSchema], // Embedding the reaction schema
  },
  {
    toJSON: {
      virtuals: true, // Including virtual properties in JSON output
      getters: true, // Applying getters (like virtuals) to JSON output
    },
  }
);

// Defining a virtual property for reaction count
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// Defining a virtual property for formatted creation date
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

// Creating the Thought model based on the schema
const Thought = model('Thought', thoughtSchema);

module.exports = Thought; // Exporting the Thought model

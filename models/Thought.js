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
      get: (date)=>{}
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



// Creating the Thought model based on the schema
const Thought = model('Thought', thoughtSchema);

module.exports = Thought; // Exporting the Thought model

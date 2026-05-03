const mongoose = require('mongoose');

const savedOutputSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      maxlength: 120,
    },
    projectId: {
      type: String,
      required: true,
      index: true,
      maxlength: 120,
    },
    title: {
      type: String,
      required: true,
      maxlength: 160,
    },
    content: {
      type: String,
      required: true,
      maxlength: 20000,
    },
    category: {
      type: String,
      default: 'General Chat',
      maxlength: 80,
    },
    type: {
      type: String,
      default: 'ai-output',
      maxlength: 80,
    },
  },
  { timestamps: true }
);

const SavedOutput = mongoose.model('SavedOutput', savedOutputSchema);
module.exports = SavedOutput;

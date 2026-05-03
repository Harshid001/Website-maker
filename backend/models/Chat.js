const mongoose = require('mongoose');

const chatMessageSchema = mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 12000,
    },
    modelProvider: {
      type: String,
      enum: ['openai', 'gemini', 'claude', 'local'],
      default: 'openai',
    },
    category: {
      type: String,
      default: 'General Chat',
      maxlength: 80,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const projectContextSchema = mongoose.Schema(
  {
    projectName: { type: String, maxlength: 160 },
    businessType: { type: String, maxlength: 160 },
    targetAudience: { type: String, maxlength: 220 },
    designStyle: { type: String, maxlength: 220 },
    goal: { type: String, maxlength: 300 },
  },
  { _id: false }
);

const chatSchema = mongoose.Schema(
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
    projectContext: projectContextSchema,
    messages: [chatMessageSchema],
  },
  { timestamps: true }
);

chatSchema.index({ userId: 1, projectId: 1 }, { unique: true });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;

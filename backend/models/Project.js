const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { 
      type: String, 
      required: true, 
      enum: ['website', 'design2d', 'animation', 'model3d'] 
    },
    content: { type: Object, required: true },
    pages: { type: Array, default: [] },
    currentPageId: { type: String },
    seo: { type: Object, default: {} },
    interactions: { type: Array, default: [] },
    routes: { type: Array, default: [] },
    nodesMap: { type: Object, default: {} },
    thumbnail: { type: String },
    status: { type: String, default: 'draft' },
    projectName: { type: String },
    businessType: { type: String },
    targetAudience: { type: String },
    designStyle: { type: String },
    goal: { type: String },
    category: { type: String },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

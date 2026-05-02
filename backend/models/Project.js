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
    thumbnail: { type: String },
    status: { type: String, default: 'draft' },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

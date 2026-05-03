const mongoose = require('mongoose');
const Project = require('../models/Project');
const SavedOutput = require('../models/SavedOutput');

const getRelevantProjectKnowledge = async (projectId, message) => {
  const savedOutputs = await SavedOutput.find({ projectId })
    .sort('-createdAt')
    .limit(5)
    .lean();

  const sections = [];

  if (mongoose.Types.ObjectId.isValid(projectId)) {
    const project = await Project.findById(projectId).lean();
    if (project) {
      sections.push(
        [
          'Project record:',
          `Name: ${project.projectName || project.name || 'Not provided'}`,
          `Type: ${project.category || project.type || 'Not provided'}`,
          `Business Type: ${project.businessType || 'Not provided'}`,
          `Target Audience: ${project.targetAudience || 'Not provided'}`,
          `Design Style: ${project.designStyle || 'Not provided'}`,
          `Goal: ${project.goal || 'Not provided'}`,
        ].join('\n')
      );
    }
  }

  if (savedOutputs.length) {
    sections.push(
      [
        'Saved project outputs:',
        ...savedOutputs.map((output) => {
          const snippet = output.content.length > 700
            ? `${output.content.slice(0, 700)}...`
            : output.content;
          return `- ${output.title} (${output.category}): ${snippet}`;
        }),
      ].join('\n')
    );
  }

  if (message) {
    sections.push(`Current user intent keywords: ${message.slice(0, 240)}`);
  }

  return sections.join('\n\n');
};

module.exports = { getRelevantProjectKnowledge };

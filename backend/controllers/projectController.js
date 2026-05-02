const Project = require('../models/Project');

const getProjects = async (req, res) => {
  const projects = await Project.find({ user: req.user._id }).sort('-createdAt');
  res.json(projects);
};

const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    if (project.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

const createProject = async (req, res) => {
  const { name, type, content, thumbnail } = req.body;

  const project = new Project({
    user: req.user._id,
    name,
    type,
    content,
    thumbnail,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
};

const updateProject = async (req, res) => {
  const { name, content, thumbnail, status, slug } = req.body;
  const project = await Project.findById(req.params.id);

  if (project) {
    project.name = name || project.name;
    project.content = content || project.content;
    project.thumbnail = thumbnail || project.thumbnail;
    project.status = status || project.status;
    project.slug = slug || project.slug;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

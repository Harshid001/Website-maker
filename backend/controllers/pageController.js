const Project = require('../models/Project');

const getPages = async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (project) {
    res.json(project.pages || []);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

const getPageById = async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (project) {
    const page = (project.pages || []).find((p) => p.id === req.params.pageId);
    if (page) {
      res.json(page);
    } else {
      res.status(404);
      throw new Error('Page not found');
    }
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

const addPage = async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (project) {
    const page = req.body;
    project.pages = [...(project.pages || []), page];
    await project.save();
    res.status(201).json(page);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

const updatePage = async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (project) {
    let updatedPage = null;
    project.pages = (project.pages || []).map((page) => {
      if (page.id === req.params.pageId) {
        updatedPage = { ...page, ...req.body };
        return updatedPage;
      }
      return page;
    });
    
    if (updatedPage) {
      await project.save();
      res.json(updatedPage);
    } else {
      res.status(404);
      throw new Error('Page not found');
    }
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

const deletePage = async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (project) {
    const initialLength = project.pages?.length || 0;
    project.pages = (project.pages || []).filter((p) => p.id !== req.params.pageId);
    
    if (project.pages.length < initialLength) {
      await project.save();
      res.json({ message: 'Page removed' });
    } else {
      res.status(404);
      throw new Error('Page not found');
    }
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

module.exports = {
  getPages,
  getPageById,
  addPage,
  updatePage,
  deletePage,
};

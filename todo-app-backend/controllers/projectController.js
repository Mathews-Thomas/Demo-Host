const Project = require('../models/Project');
const axios = require('axios');

const getProjects = async (req, res) => {
  const projects = await Project.find({ userId: req.user._id });
  res.json(projects);
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found or not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error });
  }
};

const createProject = async (req, res) => {
  const { title } = req.body;
  const project = new Project({ title, userId: req.user._id });
  await project.save();
  res.status(201).json(project);
};

const updateProject = async (req, res) => {
  const { title } = req.body;
  const project = await Project.findById(req.params.id);
  if (project) {
    project.title = title || project.title;
    await project.save();
    res.json(project);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.deleteOne();
    res.status(200).json({ message: 'Project removed' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const addTodo = async (req, res) => {
  const { description } = req.body;
  const project = await Project.findById(req.params.id);
  if (project) {
    project.todos.push({ description });
    await project.save();
    res.json(project);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
};

const updateTodo = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (project) {
    const todo = project.todos.id(req.params.todoId);
    if (todo) {
      todo.description = req.body.description || todo.description;
      todo.status = req.body.status || todo.status;
      await project.save();
      res.json(project);
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (project) {
      const todo = project.todos.id(req.params.todoId);
      if (todo) {
        // Remove the todo from the array
        project.todos = project.todos.filter(todo => todo._id.toString() !== req.params.todoId);
        await project.save();  // Save the project after removing the todo
        res.json({ message: 'Todo removed', project });
      } else {
        res.status(404).json({ message: 'Todo not found' });
      }
    } else {
      res.status(404).json({ message: 'Project not found or not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error });
  }
};

const exportGist = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (project) {
    const pendingTodos = project.todos
      .filter(todo => todo.status === 'pending')
      .map(todo => `- [ ] ${todo.description}`);
    const completedTodos = project.todos
      .filter(todo => todo.status === 'completed')
      .map(todo => `- [x] ${todo.description}`);

    const content = `# ${project.title}\n\n## Summary\n${completedTodos.length} / ${project.todos.length} completed\n\n## Pending Todos\n${pendingTodos.join('\n')}\n\n## Completed Todos\n${completedTodos.join('\n')}`;

    try {
      const response = await axios.post(
        'https://api.github.com/gists',
        {
          files: {
            [`${project.title}.md`]: { content },
          },
          public: false, // Secret gist
        },
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`, // Use the token from the environment variable
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error('Error exporting gist:', error);
      res.status(500).json({ message: 'Failed to export gist' });
    }
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
};


module.exports = { getProjects, createProject, updateProject, deleteProject, addTodo, updateTodo, deleteTodo, exportGist ,getProjectById};

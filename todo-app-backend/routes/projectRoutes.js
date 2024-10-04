const express = require('express');
const { getProjects, createProject, updateProject, deleteProject, addTodo, updateTodo, deleteTodo, exportGist,getProjectById } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
   .get(protect,getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject)

router.route('/:id/todos')
  .post(protect, addTodo);

router.route('/:id/todos/:todoId')
  .put(protect, updateTodo)
  .delete(protect, deleteTodo);

router.route('/:id/export').post(protect, exportGist);

module.exports = router;

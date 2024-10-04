const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  description: { type: String, required: true },
  status: { type: String, default: 'pending' }, // pending or completed
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  todos: [todoSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

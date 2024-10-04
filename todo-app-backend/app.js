const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

dotenv.config();
const app = express();

app.use(cors({
  origin: 'https://your-frontend.vercel.app', // Replace with your Vercel URL
  methods: 'GET,POST,PUT,DELETE', // Define allowed methods
  credentials: true // Set to true if using cookies or authentication
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => console.error('Connection error', err));

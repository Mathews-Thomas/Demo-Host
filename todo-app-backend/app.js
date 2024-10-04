const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

dotenv.config();
const app = express();

const allowedOrigins = [
  'https://demo-host-ten.vercel.app',
  'https://demo-host-git-main-mathews-projects-4bf55ff3.vercel.app',
  'https://demo-host-kaw9hbyb4-mathews-projects-4bf55ff3.vercel.app',  // Add other URLs as needed
  'http://localhost:5173'             // Local development URL, if needed
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE', // Define allowed methods
  credentials: true               // Enable credentials if needed
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

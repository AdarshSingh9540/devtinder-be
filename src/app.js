const express = require('express');
const connectDB = require('./utils/database');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/authRoute');
const profileRoute = require('./routes/profile');
const authMiddleware = require('./middlewares/authMiddleware');
const sendConnectionRequest = require('./routes/request');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoute);
app.use('/api',authMiddleware, profileRoute);
app.use('/api',authMiddleware, sendConnectionRequest);

connectDB()
  .then(() => {
    console.log('MongoDB connected');
    app.listen(3210, () => {
      console.log('Server is running on port 3210');
    });
  })
  .catch((err) => {
    console.log('Database connection error:', err);
  });

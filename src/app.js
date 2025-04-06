const express = require('express');
const connectDB = require('./utils/database');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/authRoute');
const profileRoute = require('./routes/profile');
const authMiddleware = require('./middlewares/authMiddleware');
const sendConnectionRequest = require('./routes/request');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));  
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoute);
app.use('/api',authMiddleware, profileRoute);
app.use('/api',authMiddleware, sendConnectionRequest);

connectDB()
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });    
  })
  .catch((err) => {
    console.log('Database connection error:', err);
  });

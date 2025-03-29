const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGODB_URL)
}

module.exports = connectDB;


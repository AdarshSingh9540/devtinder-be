const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://adarsh9540984202:passwordpassword@cluster0.yju1yru.mongodb.net/tinder')
}

module.exports = connectDB;


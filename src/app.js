const express = require('express');
const connectDB = require('./utils/database');
const User = require('./model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middlewares/authMiddleware');
const app = express();
require('dotenv').config();


app.use(express.json());
app.use(cookieParser());
app.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, age, gender, email, password } = req.body;

        const hashPassword = await bcrypt.hash(password,10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
            age,
            gender
        });

        await user.save();

        res.status(201).json({ message: "Signup successful", user });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error: error.message });
    }
});

app.post('/login',async(req,res)=>{
    try{
        const {email,password} = req.body;
        const isUser =  await User.findOne({email});
        if(!isUser){
            return res.status(404).json({message:"User not found"});
        }
        const isValidPassword = await isUser.validatePassword(password);
        if(!isValidPassword){
            return res.status(401).json({message:"Invalid credientials"});
        }
        const token = await isUser.getJWT();
        res.cookie("token",token);
        res.status(200).json({message:"Login successful",user:isUser});
    }catch(err){
        res.status(500).json({message:"Error in login",error:err.message});
    }
});

app.get('/profile', authMiddleware,async(req,res) =>{
    try{
        const user = req.user;
        res.status(200).send({message:"User profile",user});
    }catch(err){
        res.status(500).json({message:"Error in fetching profile",error:err.message});
    }
});

app.put("/update",async (req,res)=>{
    try{
        const { userId, firstName, lastName, age } = req.body;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.age = age || user.age;
        await user.save();
        res.json({ message: "User Updated Successfully", user });
    }catch(err){
        res.status(500).json({message:"Error in updating user",error:err.message});
    }
})



connectDB().then(()=>{
    console.log("MongoDB connected");
    app.listen(3210,()=>{
        console.log("Server is running on port 3210")
    })
}).catch((err)=>{
    console.log(err)
})


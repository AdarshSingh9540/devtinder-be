const express = require('express');
const connectDB = require('./utils/database');
const User = require('./model/userModel');
const bcrypt = require('bcrypt');
const app = express();
require('dotenv').config();
require('./utils/database');
app.use(express.json());

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
        const isValidPassword = await bcrypt.compare(password,isUser.password);
        if(!isValidPassword){
            return res.status(401).json({message:"Invalid credientials"});
        }
        res.status(200).json({message:"Login successful",user:isUser});
    }catch(err){
        res.status(500).json({message:"Error in login",error:err.message});
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


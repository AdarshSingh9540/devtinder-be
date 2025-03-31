const express = require('express');
const router = express.Router();
const User = require('../model/userModel');
const bcrypt = require('bcrypt'); 
const cookieParser = require('cookie-parser');
router.post('/signup', async (req, res) => {
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


router.post('/login',async(req,res)=>{
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

router.post('/logout',(req,res) =>{
    res.cookie('token',null,{expires:new Date(Date.now())});
    res.status(200).json({message:"Logout successful"});
})





module.exports = router;


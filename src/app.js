const express = require('express');
const connectDB = require('./utils/database');
const User = require('./model/userModel');

const app = express();
require('dotenv').config();
require('./utils/database');
app.use(express.json());

app.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, age, gender, email, password } = req.body;

        const user = new User({
            firstName,
            lastName,
            email,
            password,
            age,
            gender
        });

        await user.save();

        res.status(201).json({ message: "Signup successful", user });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error: error.message });
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


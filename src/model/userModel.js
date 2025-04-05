const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
          validator: (value) => validator.isEmail(value),
          message: "Invalid Email",
        },
      },
      imgUrl: {
        type: String,
        validate: {
          validator: (value) => validator.isURL(value),
          message: "Invalid URL",
        },
      },

    age:{
        type:String,
        
    },
    gender:{
        enum:['male',"female","other"],
        type:String,
    },

},
{
    timestamps:true
});

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
    return token;
}

userSchema.methods.validatePassword =  function(passwordInputByUser){
    const user = this;
    const hashPassword = user.password;
    const isValidPassword =  bcrypt.compare(passwordInputByUser,hashPassword);
    return isValidPassword;
};
module.exports = mongoose.model('User', userSchema);

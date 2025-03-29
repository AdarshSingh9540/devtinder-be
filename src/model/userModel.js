const { default: mongoose } = require("mongoose");
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
      imgURL: {
        type: String,
        validate: {
          validator: (value) => validator.isURL(value),
          message: "Invalid URL",
        },
      },

    age:{
        type:Number,
        min:18
    },
    gender:{
        enum:['MALE',"FEMALE","OTHER"],
        type:String,
    },

},
{
    timestamps:true
}
)

module.exports = mongoose.model('User', userSchema);

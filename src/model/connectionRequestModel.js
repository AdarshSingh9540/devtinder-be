const { default: mongoose } = require("mongoose");

const connectionRequest = new mongoose.Schema({
    senderUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },

    receiverUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },

    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","accepted","rejected","interested"],
            message:`{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps:true,
}
)

const ConnectionRequestModel = new mongoose.model("ConnectionRequestModel",connectionRequest);

module.exports = ConnectionRequestModel
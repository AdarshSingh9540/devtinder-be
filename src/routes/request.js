const express = require('express');
const ConnectionRequestModel = require('../model/connectionRequestModel');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../model/userModel');
const router = express.Router();

router.post('/send/:status/:receiverUserId',authMiddleware,async(req,res)=>{
     try{
          const senderUserId =  req.user._id;
          const receiverUserId = req.params.receiverUserId;
          const status = req.params.status;

          const allowedStatus = ["ignored","interested"];
          if(!allowedStatus.includes(status)){
               return res.status(400).json({
                    message:"Invalid status type" + status
               })
          }
          if (senderUserId.equals(receiverUserId)) {
               return res.status(400).json({ message: "You cannot send a connection request to yourself!" });
          }
          

          const existingConnection = await ConnectionRequestModel.findOne({
               $or:[
                    {senderUserId,receiverUserId},
                    {senderUserId:receiverUserId,receiverUserId:senderUserId}
               ]
          })

          if(existingConnection){
               return res.status(200).json({
                    message:"Connection request already sent!"
               })
          }


         const isReceiverExist  = await User.findById(receiverUserId);
         if(!isReceiverExist){
          return res.status(400).json({message:"user not found"})
         }

          const connectionRequest  = new ConnectionRequestModel({
               senderUserId,
               receiverUserId,
               status,
          })

          const data = await connectionRequest.save();
          res.status(200).json({
               message:req.user.firstName+" is "+ status +" in " + isReceiverExist.firstName
          })
     }catch(error){
          res.status(400).json("Error "+ error.message);
     }
})

module.exports = router;
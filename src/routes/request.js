const express = require('express');
const ConnectionRequest = require('../model/connectionRequestModel');
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
          

          const existingConnection = await ConnectionRequest.findOne({
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

          const connectionRequest  = new ConnectionRequest({
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

router.post('/request/review/:status/:requestId',authMiddleware,async(req,res)=>{
     try{
          const {status , requestId} = req.params;
          const logInUser = req.user;

          const allowedStatus = ['accepted', 'rejected'];
          if (!allowedStatus.includes(status)) {
              return res.status(400).json({ message: "Status type is not allowed" });
          }

          const connectionRequest = await ConnectionRequest.findOne({
               _id:requestId,
               receiverUserId:logInUser._id,
               status:'interested'
          })

          if(!connectionRequest){
               return res.status(400).json({message :"Connection Request not found"});
          }

          connectionRequest.status = status;
          const data= await connectionRequest.save();

          res.status(200).json({message:"Connection Request"+status,data});
     }catch(err){
          res.status(400).send("error "+err);
     }
})
module.exports = router;
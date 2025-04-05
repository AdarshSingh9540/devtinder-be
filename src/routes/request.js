const express = require('express');
const ConnectionRequest = require('../model/connectionRequestModel');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../model/userModel');
const { set } = require('mongoose');
const router = express.Router();

router.post('/send/:status/:receiverUserId',async(req,res)=>{
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

router.post('/request/review/:status/:requestId',async(req,res)=>{
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

router.get('/user/requests/received',async(req,res) =>{
     try{
          const logInUser = req.user;

          const connectionRequest = await ConnectionRequest.find({
               receiverUserId:logInUser._id,
               status:'interested',
          }).populate(
               "senderUserId", "firstName lastName age"
          )

          res.json({
               message:"Data...",
               data:connectionRequest
          });
     }catch(err){
          res.status(400).send("error" + err.message);
     }
})

router.get('/user/connections',async(req,res)=>{
     try{
          const logInUser = req.user;

          const connections = await ConnectionRequest.find({
               $or: [
                   {receiverUserId:logInUser._id,status:'accepted'},
                   {senderUserId:logInUser._id,status:'accepted'}
               ],
     }).populate("senderUserId","firstName lastName").populate("receiverUserId","firstName lastName");

     const data = connections.map(row => 
          row.senderUserId._id.toString() === logInUser._id.toString()
              ? row.receiverUserId
              : row.senderUserId
      );

     res.status(200).json({message:"Connection found successfully",data});

     }catch(err){
          res.status(400).send("error" + err.message);
     }
})

router.get('/feed',authMiddleware,async(req,res)=>{
     try{
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.skip) || 1;
          const skip = (page-1)*limit;
          const logInUser = req.user;
          const connection = await ConnectionRequest.find({
               $or:[
                    {receiverUserId:logInUser._id},
                    {senderUserId:logInUser._id}
               ]
          }).select('senderUserId receiverUserId');
          // .populate('receiverUserId' , 'firstName').populate('senderUserId' ,'firstName');

          const hideUser = new Set();
        connection.forEach((req) => {
            hideUser.add(req.senderUserId.toString());
            hideUser.add(req.receiverUserId.toString());
        });

        const users = await User.find({
          $and: [{_id:{$nin: Array.from(hideUser)}},

               {_id: {$ne:logInUser._id}},
          ]
        }).skip(skip).limit(limit);

        res.status(200).json({
            message: "All connection requests retrieved successfully",
            users,
          //   hideUser: Array.from(hideUser)
        });
     }catch(err){
          res.status(400).send("error "+err.message);
     }
})
module.exports = router;
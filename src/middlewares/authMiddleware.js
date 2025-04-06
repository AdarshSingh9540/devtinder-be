const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const authMiddleware = async(req,res,next)=>{
    try{
        const {token} = req.cookies;
    if(!token){
        return res.status(401).json({message:"Login Required"});
    }
    const decodeToken = jwt.verify(token,"adarsh");
     const {_id}= decodeToken;
    const user = await User.findById({_id});
    if(!user){
        return res.status(401).json({message:"Unauthorized"});
    }

    req.user = user;
    next();

}catch(err){
    res.status(500).json({message:"Error in auth middleware",error:err.message});
}
}

module.exports = authMiddleware;

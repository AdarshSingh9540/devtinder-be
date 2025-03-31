const express = require('express');
const router = express.Router();

router.post('/sendConnectionRequest',async(req,res)=>{
     const user = req.user;
     console.log(user);
     res.send(user.firstName+" Connection request sent");
})

module.exports = router;
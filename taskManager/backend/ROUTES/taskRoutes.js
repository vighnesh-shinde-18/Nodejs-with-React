const express = require('express')
const user = require('../MODELS/user')
const router = express.Router();


router.get('/',(req,res)=>{
   res.send('task routes')
 })

module.exports = router;
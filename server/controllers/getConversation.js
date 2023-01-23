const {User} = require('../models/user')

const getConversations = async(req,res) =>{
    try{
        const user = await User.findOne({_id: req.params.id})
        const conversation = user?.conversation  
        res.json({conversation})
    }catch(err){
        console.log(err);
    }
}

module.exports = getConversations
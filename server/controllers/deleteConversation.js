const {User} = require('../models/user')

const deleteConversation = async(req,res) =>{
    const {senderId, conversationId} = req.params
    try{
        const response =  await User.updateOne({_id: senderId},{$pull:{conversation:{_id: conversationId}}})
        res.json({
            response
        })
        
    }catch(err){
        console.log(err);
    }
}

module.exports = deleteConversation
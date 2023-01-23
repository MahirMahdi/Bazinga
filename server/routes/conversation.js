const multer  = require('multer');
const deleteConversation = require('../controllers/deleteConversation');
const getConversations = require('../controllers/getConversation');
const startConversation = require('../controllers/startConversation');

//multer configuration
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads')
    },
    filename:function(req,file,cb){
        cb(null, file.originalname)
    }
});

const upload = multer({storage:storage});
const router = require('express').Router();

//starts or updates a conversation 
router.post('/conversation',upload.single('image'),startConversation)

// gets all conversations of a specific user
router.get('/conversation/:id', getConversations)

//deletes a specific conversation from the initiator's database only
router.post('/conversation/:senderId/:conversationId', deleteConversation)

module.exports = router
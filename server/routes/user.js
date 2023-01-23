const multer  = require('multer');
const jwt = require('jsonwebtoken');

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
const passport = require("passport");
const SignupController = require('../controllers/register');
const LoginController = require('../controllers/auth');
const RefreshTokenHandler = require('../controllers/refresh');
const LogoutController = require('../controllers/logout');
const GetUsers = require('../controllers/users');
const GetChatUser = require('../controllers/chatuser');
const DeleteUser = require('../controllers/deleteUser')

// gets users based on search
router.get('/user/:username', GetUsers)

//gets a specific user details
router.get('/chatuser/:id', GetChatUser)

//handles signup
router.post('/signup',upload.single('image'),SignupController)

//handles login
router.post('/login',LoginController)

// handles persistent login verifying refresh token and providing access token
router.get('/refresh', RefreshTokenHandler)

//handles logout
router.post('/logout', LogoutController)

//deletes user
router.post('/delete-account/:id', DeleteUser)

// handles google authentication
router.get('/auth/google',passport.authenticate('google', { scope: ['email','profile'] }))

//redirects to server for assigning refresh and access token if authentication is successful
router.get('/auth/google/bazinga', passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login`}),function(req,res,Redirect){
        
        const {_id, username, img} = req.user;
        const accessToken = jwt.sign({username: username, id: _id, img: img},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'900s'});
        const refreshToken = jwt.sign({username: username, id: _id, img: img},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'});
        
        //sets cookie and redirects to client
        res.cookie('jwt', refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:'none',
            maxAge: 24 * 60 * 60 * 1000
        }).redirect(301,process.env.CLIENT_URL)
})

// handles facebook authentication
router.get('/auth/facebook',passport.authenticate('facebook', { scope: ['public_profile', 'email'] }))

//redirects to server for assigning refresh and access token if authentication is successful
router.get('/auth/facebook/bazinga', passport.authenticate('facebook', { failureRedirect: `${process.env.CLIENT_URL}/login`}),function(req,res,Redirect){

        const {_id, username, img, email} = req.user;
        const accessToken = jwt.sign({username: username, id: _id, img: img},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'900s'});
        const refreshToken = jwt.sign({username: username, id: _id, img: img},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'});
        
        //sets cookie and redirects to client
        res.cookie('jwt', refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:'none',
            maxAge: 24 * 60 * 60 * 1000
        }).redirect(301,process.env.CLIENT_URL)
        
})



module.exports = router;

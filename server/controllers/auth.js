const {User} = require('../models/user');
const jwt = require('jsonwebtoken');
const { comparePassword } = require('../utils/bcrypt');

const LoginController = async(req,res)=>{
    const {email, password} = req.body;

    //checks if both email and password are provided
    if(!email || !password){
        res.status(401).json({
            success: false,
            message:"All fields are required."
        })
    }

    //checks if user exits
    const user = await User.findOne({email:email});
    if(!user){
        return res.status(401).json({
            success:false,
            message:"Incorrect username or password!"
        });
    }

    //if user exists with the given email then checks if the password is correct
    const passwordMatch = comparePassword(password, user.password);
    if(!passwordMatch){
        return res.status(401).json({
            success:false,
            message:"Incorrect username or password!"
        });
    }

    //if given info is correct then it sends the response with user data, access token and refresh token
    if(user && passwordMatch){
        const {_id, email, username, img,conversation} = user;
        const accessToken = jwt.sign({username: username, id: _id, img: img},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'900s'});
        const refreshToken = jwt.sign({username: username, id: _id, img: img},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'});
        res.cookie('jwt', refreshToken, {
            secure:true,
            sameSite: 'None',
        })
        res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            user: {_id, username, img, email,conversation},
            accessToken
        })
    }
}

module.exports = LoginController
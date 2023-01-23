const {User} = require('../models/user');
const jwt = require('jsonwebtoken');

const RefreshTokenHandler = (req,res) =>{

    //refresh token is sent through cookies
    const cookies = req.cookies;

    //checks if refresh token exists
    if(cookies?.jwt){
        const refreshToken = cookies.jwt;
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async(err, decoded)=>{
                if(err){
                    res.status(403).json({message:"Forbidden"})
                }else{
                    const user = await User.findOne({username: decoded.username})
                    if(user){
                        const {username, _id, img, email,conversation} = user
                        const accessToken = jwt.sign(
                            {'UserInfo' : {
                                'username': user.username,
                                'img': user.img,
                                'id': user._id
                            }},
                            process.env.ACCESS_TOKEN_SECRET,
                            {expiresIn:'900s'}
                        )
                        
                        //sends new access token 
                        res.json({user:{username,email,_id,img,conversation},accessToken})
                    }else{
                        res.status(401).json({message:'Unauthorized user'})
                    }
                }
            }
        )
    }else{
        res.status(401).json({message: "Unauthorized Token"})
    }


    //verifies refresh token
}

module.exports = RefreshTokenHandler
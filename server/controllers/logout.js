const LogoutController = (req,res) => {
    
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.json({message: "Cookie cleared"})
}

module.exports = LogoutController
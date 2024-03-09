const PostRegister = async (req, res) => {
    Object.keys(req.cookies).forEach(cookieName => {
        res.clearCookie(cookieName);
      });
    
    res.cookie("walletID", req.body.wallet_id);
    res.cookie("role", req.body.role);
    res.cookie("name", req.body.name);
    res.json("OK")
}

const PostLogin = async (req, res) => {
    Object.keys(req.cookies).forEach(cookieName => {
        res.clearCookie(cookieName);
      });
    
    res.cookie("walletID", req.body.wallet_id);
    res.cookie("role", req.body.role);
    res.cookie("name", req.body.name);
    res.json("OK")
}

const logout = async(req,res)=>{
    res.clearCookie("name");
    res.clearCookie("role");
    res.clearCookie("walletID");
    res.redirect('/')
}

module.exports = {PostRegister,PostLogin,logout}
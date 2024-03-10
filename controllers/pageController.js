const homePage = async(req,res)=>{
    res.render('index')
}

const loginPage = async(req,res)=>{
    res.render('login')
}

const registerPage = async(req,res)=>{
    res.render('register')
}

const verificationPage = async(req,res)=>{
    res.render('verification')
}

const profilePage = async(req,res)=>{
    res.render('profile')
}

const adminVerificationPage = async(req,res)=>{
    res.render('platformVerification')
}

const publicProfilePage = async(req,res)=>{
    res.render('publicProfile',{walletID:req.params.wallet})
}

const CollaborationPage = async(req,res)=>{
    res.render('collaboration')
}

const CommunityPage = async(req,res)=>{
    res.render('community')
}



module.exports = {homePage, loginPage, registerPage, verificationPage, profilePage, adminVerificationPage, publicProfilePage, CollaborationPage, CommunityPage}

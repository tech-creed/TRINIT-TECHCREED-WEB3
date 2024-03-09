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

module.exports = {homePage, loginPage, registerPage, verificationPage, profilePage}

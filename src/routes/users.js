const { Router } = require("express");
const router = Router();
const User = require("../models/user");
const passport = require("passport");

router.get('/users/signin', (req, res) =>
{
    res.render('users/signin');
});

router.get('/users/signup', (req, res) =>
{
    res.render('users/signup');
});

router.post('/users/signin', passport.authenticate("local", {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.post('/users/signup', async (req, res) =>
{
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    
    // El siguiente trabajo de validacion se podria realizar de ua forma mas sencilla con el modulo express-validator
    
    if(name.length == 0 || email.length == 0) 
    {
        errors.push({text: "Please insert all data"});
    }
    if(password != confirm_password)
    {
        errors.push({text: "Password do not match"});
    } 
    if(password.length < 4)
    {
        errors.push({text: "Pasword must be at least 4 characters"});
    }
    if(errors.length > 0)
    {
        res.render('users/signup', {errors, name, email, password, confirm_password});
    }
    else
    {
        const emailUser = await User.findOne({email: email});
        if(emailUser)
        {
            req.flash("error_msg", "Email is already in use");
            res.redirect("/users/signup")
        }
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash("success_msg", "You are registered");
        res.redirect("/users/signin");
    }
});

router.get('/users/logout',(req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
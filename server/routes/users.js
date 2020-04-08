const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Expense = require('../models/expense');
const expenseController = require('../controllers/expense-controllers')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name, 
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg:"Failed to register user"});
        } else {
            res.json({success: true, msg:"User registered"});
        }
    })
});

router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user) {
            return res.json({success:false, msg: 'User nor found'});
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                const token = jwt.sign({data:user}, config.secret, {
                    expiresIn: 604800 //1 week
                });
                res.json({
                    success: true, 
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username:user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({success:false, msg: 'Wrong password'});
            }
        }); 
    })
});

router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

router.get('/expense', expenseController.list);
router.post('/expense', expenseController.save);
router.get('/expense/:id', expenseController.get);
router.put('/expense/:id', expenseController.update);
router.delete('/expense/:id', expenseController.delete);
router.get('/barchart/:month', expenseController.list);

// router.get('/barchart', function(req,res,callback){

//     blogPostData(function(result){
//         var month_data = result.month_data;
//         var number_of_posts_data = result.number_of_posts_data；

//         console.log;
        
//     })
// })

module.exports = router;
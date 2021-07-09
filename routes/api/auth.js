const express = require('express');
const {check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

const config = require('config');
const User = require('../../models/user');
const auth = require('../../middleware/auth');

// @route   GET api/auth
// @desc    Get user by Id
// @access  Public
router.get('/',auth, async (req,res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(error){
        console.log(error.message)
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/',
    [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 
              'password is required!')
              .exists()
    ], 
    async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try {
        //See if user exists
        let user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({errors: [{msg: 'User not exists!'}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({errors: [{msg: 'Invalid pasword !'}]});
        }

        //Return jsonwebtoken
        const payload = {
            user: { 
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            {expiresIn: '1h'},
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            } 
        )
    } 
    catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});


module.exports = router;
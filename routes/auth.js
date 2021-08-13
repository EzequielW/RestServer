const express = require('express')
const router = express.Router()
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation } = require('../validation')

router.post('/register', async (req, res) => {
    // Data validation
    const {err} = registerValidation(req.body)
    if(err) return res.status(400).send(err.details[0].message)

    const emailExists = await User.findOne({ email: req.body.email })
    if(emailExists) return res.status(400).send('Email already exists')

    const nameExists = await User.findOne({ name: req.body.name })
    if(nameExists) return res.status(400).send('Username already exists')

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // User creation
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try{
        const savedUser = await user.save()
        res.json({ user: user._id })
        res.end()
    } catch(err){
        res.status(400).send(err)
    }
})

router.post('/login', async (req, res) => {
    // Data validation
    const {err} = loginValidation(req.body)
    if(err) return res.status(400).send(err.details[0].message)

    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Email or password wrong')

    // Check if the passwords match else send message error
    try{
        bcrypt.compare(req.body.password, user.password, (err, isValid) => {
            if(isValid){
                // Generate token
                const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
                res.send({"auth_token":token})
            }
            else{
                res.status(400).send("Email or password incorrect")
            }
        })
    }
    catch(err){
        res.status(500).send("Internal server error" + err)
    } 
})

module.exports = router
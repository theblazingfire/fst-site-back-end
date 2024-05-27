const User = require('../models/auth')
let jwt = require('jsonwebtoken')
let bcrypt = require('bcryptjs')
let generateID = require('../utils/generateID')

const addUser = (req, res, next) => {
    let {email,password} = req.body
    // add validation for email and password. if email is not valid, return an error,if password is less than 8 chars, return another error, prevent save.
    let userId = generateID()
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    let UserDoc = new User({email,hash,userId})
    UserDoc.save().then(data => {
        let userForToken = {
            email: email,
            id : userId
        }
        console.log('data',data)
        let token = jwt.sign(userForToken,process.env.SECRET,{ expiresIn: 60*60*6 })
        res.status(200).send({token})
    }).catch(err=>{
        res.status(500).send({message: 'An error occured while trying to add new user.'})
    })
}

const getUser = async (req,res,next) => {
    let {email,password} = req.body
    let user = await User.findOne({email})
    const passwordCorrect = user === null ? false: await bcrypt.compare(password, user.passwordHash)
    
    if (!(user && passwordCorrect)) {
        return res.status(401).json({
          error: 'invalid username or password'
        })
    }

    const userForToken = {
        email: user.email,
        id: user.userId,
    }
    
    const token = jwt.sign(userForToken, process.env.SECRET)
    res.status(200).send({ token })
    
}


module.exports = {
    addUser,
    getUser
}
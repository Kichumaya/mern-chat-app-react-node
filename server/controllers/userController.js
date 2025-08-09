const User = require('../model/userModel')
const bcrypt = require('bcrypt')

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const usernameCheck = await User.findOne({ username })
        if(usernameCheck) return res.json({ msg: 'Username already exist', status: false})
        const emailCheck = await User.findOne({ email })
        if(emailCheck) return res.json({ msg: 'email id already exists', status: false })
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            email,
            username,
            password: hashPassword
        })
        delete user.password
        return res.json({ status: true, user })
    } catch (ex) {
        next(ex)
    }
};


module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ email: username })
        if(!user) return res.json({ msg: 'Incorrect username or password', status: false })
        const validatePassword = await bcrypt.compare(password, user.password)
        if(!validatePassword) return res.json({ msg: 'Incorrect username or password', status: false })
        delete user.password
        return res.json({ status: true, user })
    } catch (ex) {
        next(ex)
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id
        const avatarImage = req.body.image
        const userData = await User.findByIdAndUpdate(userId, {
            isAvtarImageSet: true,
            avatarImage
        })
        return res.json({
            isSet: userData.isAvtarImageSet,
            image: userData.avatarImage
        })
    } catch (ex) {
        next(ex)
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({_id:{ $ne: req.params.id }}).select([
            'email', 'username', 'avatarImage', '_id'
        ])
        return res.json(users)
    } catch (ex) {
        next(ex)
    }
}

// module.exports.getAvatarById = async (req, res, next) => {
//     try {
//         const response = await fetch(`https://api.multiavatar.com/${req.params.id}`)
//         const svg = await response.text()
//         res.setHeader('Content-Type', 'image/svg+xml');
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.send(svg);
//     } catch (ex) {
//         res.status(500).send('Error fetching avatar');
//     }
// }

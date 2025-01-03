const Theater = require("../model/theaterloginmodel")
const jwt = require('jsonwebtoken')

function encrypt(message) {
    let key = message.length
    let res = "";
    for (let i = 0; i < message.length; i++) {
        let char = message.charCodeAt(i)
        res += String.fromCharCode(char + key--)
    }
    return res
}
function decrypt(message) {
    let res = "";
    let key = message.length
    for (let i = 0; i < message.length; i++) {
        let char = message.charCodeAt(i)
        res += String.fromCharCode(char - key--)
    }
    return res
}

const signintheater = async (req, res) => {

    let { email, password, theatername, city } = req.body;
    if (!email || !password || !theatername || !city ) {
        return res.status(400).json({ message: "All fields are required" });
    }
    let encryptPassword = encrypt(password);

    try {

        const newUser = new Theater({
            email,
            password: encryptPassword,
            theatername,
            city
        });


        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: "user email already exists", error });
    }
};

const logintheater = async (req, res) => {
    const { email, password } = req.body
    const secret = process.env.JWT_SECRET_KEY;
    const theater = await Theater.find({ email })
    console.log(theater[0])
    if (!theater[0]) {
        return res.send("user not found")
    }
    if (decrypt(theater[0].password) !== password) {
        return res.send("invalid credentials")
    }
    const token = jwt.sign({ theaterId: theater[0]._id }, secret, { expiresIn: "12h" })
    return res.json({ message: "log in successful", Atoken: token })
}

module.exports = { signintheater,logintheater }
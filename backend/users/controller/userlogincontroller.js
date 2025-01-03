const userdetails = require("../model/userloginmodel")
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

const signinUser = async (req, res) => {
 
    let { email, password, name, age, city, mobilenumber } = req.body;
    if (!email || !password || !name || !age || !city || !mobilenumber) {
        return res.status(400).json({ message: "All fields are required" });
    }

   
    let encryptPassword = encrypt(password);  

    try {
       
        const newUser = new userdetails({
            email,
            password: encryptPassword,
            name,
            age,
            city,
            mobilenumber
        });

   
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: "user email already exists", error });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body
    const secret = process.env.JWT_SECRET_KEY;
    const user = await userdetails.find({ email })
    console.log(user)
    if (!user[0])
    {
        return res.json({ message: "user not found" })
    }
    if (decrypt(user[0].password) !== password)
    {
        return res.json({ message: "invalid credentials" })
    }
    const token = jwt.sign({ userid: user[0]._id } , secret , {expiresIn : "12h"})
    return res.json({message : "success",Atoken : token})
}



module.exports = { signinUser, loginUser ,decrypt}


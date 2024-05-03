const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/userModel")

//@desc register the user
//@route Post /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    //Cheak if the fields are valid
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Fields are mandatory!");
    }
    //Cheak if the user is already exist
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered!");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    // Register the user
    if (user) {
        res.status(201).json({ _id: user.id, email: user.email, isSuccess: true });
    } else {
        res.status(400);
        throw new Error("User data not valid");
    }
});

//@desc user login
//@route Post /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //Cheak if the field are valid
    if (!email || !password) {
        res.status(400);
        throw new Error("Fields are mandatory!");
    }

    //Find the user 
    const user = await User.findOne({ email });
    //Compare the password

    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            },
        },
            process.env.ACCESS_TOKEN_SECERT,
            { expiresIn: "5m" }
        );

        res.status(200).json({ accessToken, issuccess: true });
    } else {
        res.status(401);
        throw new Error("email or password is not valid!");
    }
});

//@desc user info
//@route Get /api/users/current
//@access private
const getCurrentUser = asyncHandler(async (req, res) => {
    res.json(req.user)
});


module.exports = { registerUser, loginUser, getCurrentUser };
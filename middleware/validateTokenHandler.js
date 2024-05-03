const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    //Get the token of header
    let authHeader = req.headers.Authorization || req.headers.authorization;
    //Cheak for header format to be valid 
    if (authHeader && authHeader.startsWith("Bearer")) {
        //Save the raw token
        token = authHeader.split(" ")[1];
        //Verify the token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User is not authorized");
            }
            req.user = decoded.user;
            next();
        });

        if (!token) {
            res.status(401);
            throw new Error("User is not authorized or token is missing")
        }
    }
});

module.exports = { validateToken }
const jwt = require('jsonwebtoken');


const getTokenFromAuthString = (auth) => {
    const authArray = auth.split(" ");
    return authArray[1]; 
}

const setToken = (token, id) => {
    //Store token in redis db
}

const getAuthTokenId = (req, res) => {
    const { authorization } = req.headers;
    const token = getTokenFromAuthString(authorization);
    //Get id from redis db
}

const signToken = (email, username) =>{
    return jwt.sign({
        email,
        username
    }, "ReacttcaeR", {expiresIn: "1 days"})
}


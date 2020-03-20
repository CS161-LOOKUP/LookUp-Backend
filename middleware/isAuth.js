const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    let header = req.get("Authorization");
    if(!header) {
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        throw error;
    }
    let token = header.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "129!89.:'dfYH1AJH2_*29jahbdh13jHG!J~khasn@#");
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }

    if(!decodedToken){
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedToken.userId;

    next();
};
const User = require("../model/user");
const bcrpyt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.getUsers = (req, res, next) => {
    res.status(200).json({
        message: "Get Users"
    });
}

exports.signUp = (req, res, next) => {
    if(!validationResult(req).isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = validationResult(req).array();
        throw error;
    }
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    const email = req.body.email;
    const interests = req.body.interests;
    
    bcrpyt.hash(password, 12).then(hashedPassword => {
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            email: email,
            interests: interests
        });
        return user.save();
    }).then(result => {
        res.status(201).json({
            message: "User created successfully!",
            user: result
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}
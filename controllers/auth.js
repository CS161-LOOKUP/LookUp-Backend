const User = require("../model/user");
const Apartment = require("../model/apartment");
const bcrpyt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');

exports.getUsers = (req, res, next) => {
    User.find().then(result => {
        res.status(200).json({
            message: "Fetched all the users",
            users: result 
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getFavorite = (req, res, next) => {
    User.findById(req.body.userId)
    .then(user => {
        if(!user) {
            const error = new Error("Could not find user");
            error.statusCode = 404;
            throw error;
        }
        
        res.status(200).json({
            favorite: user.favorite
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getUserById = (req, res, next) => {
    User.findById(req.params.userId).then(user => {
        if(!user) {
            const error = new Error("Could not find user test");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: "Fetched user based on ID",
            user: user
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

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
};

exports.login = (req, res, next) => {
    let loadedUser;
    User.findOne({email: req.body.email}).then(user => {
        if (!user) {
            const error = new Error("User not found!");
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrpyt.compare(req.body.password, user.password);
    }).then(isEqual => {
        if(!isEqual) {
            const error = new Error("Incorrect password");
            error.statusCode = 401;
            throw error;
        }
        let token = jwt.sign(
            {email: loadedUser.email, userId: loadedUser._id.toString()},
            "129!89.:'dfYH1AJH2_*29jahbdh13jHG!J~khasn@#", { expiresIn: "2h" }
        );
        res.status(200).json({token: token, userId: loadedUser._id.toString()});
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.addFavorite = (req, res, next) => {
    let apartmentRef;
    Apartment.findById(req.body.apartmentId)
    .then(apartment => {
        if(!apartment) {
            const error = new Error("Apartment not found");
            error.statusCode = 401;
            throw error;
        }
        apartmentRef = apartment;
        return User.findById(req.userId);
    }).then(user => {
        user.favorite.push(apartmentRef._id);
        return user.save();
    }).then(updatedUser => {
        res.status(201).json({
            message: "Added favorite to user",
            user: updatedUser._id,
            apartment: apartmentRef._id
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
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
    User.findById(req.userId)
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

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    
    const music_dict = {};
    music_dict["slow"] = req.body.music[0];
    music_dict["fast"] = req.body.music[1];
    music_dict["country"] = req.body.music[2];
    music_dict["hiphop"] = req.body.music[3];

    const movie_dict = {};
    movie_dict["comedy"] = req.body.movie[0];
    movie_dict["thriller"] = req.body.movie[1];
    movie_dict["horrer"] = req.body.movie[2];
    movie_dict["sci_fi"] = req.body.movie[3];

    const hobbies_interests_dict = {};
    hobbies_interests_dict["sports"] = req.body.hobbies_interests[0];
    hobbies_interests_dict["shopping"] = req.body.hobbies_interests[1];
    hobbies_interests_dict["pets"] = req.body.hobbies_interests[2];
    hobbies_interests_dict["socializing"] = req.body.hobbies_interests[3];

    bcrpyt.hash(password, 12).then(hashedPassword => {
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            email: email,
            movie: movie_dict,
            music: music_dict,
            hobbies_interests: hobbies_interests_dict
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

exports.randomUser = (req, res, next) => {
    // if(!validationResult(req).isEmpty()) {
    //     const error = new Error("Validation failed.");
    //     error.statusCode = 422;
    //     error.data = validationResult(req).array();
    //     throw error;
    // }
    for (i = 0; i < 100; i++) {
        const firstName = "First Name " + i;
        const lastName = "Last Name " + i;
        const password = "firstlast" + i;
        const phoneNumber = "408000000" + i;
        const email = "email" + i + "@email.com";
    
        const music_dict = {};
        music_dict["slow"] = getRandomIntInclusive(1, 5);
        music_dict["fast"] = getRandomIntInclusive(1, 5);
        music_dict["country"] = getRandomIntInclusive(1, 5);
        music_dict["hiphop"] = getRandomIntInclusive(1, 5);

        const movie_dict = {};
        movie_dict["comedy"] = getRandomIntInclusive(1, 5);
        movie_dict["thriller"] = getRandomIntInclusive(1, 5);
        movie_dict["horrer"] = getRandomIntInclusive(1, 5);
        movie_dict["sci_fi"] = getRandomIntInclusive(1, 5);

        const hobbies_interests_dict = {};
        hobbies_interests_dict["sports"] = getRandomIntInclusive(1, 5);
        hobbies_interests_dict["shopping"] = getRandomIntInclusive(1, 5);
        hobbies_interests_dict["pets"] = getRandomIntInclusive(1, 5);
        hobbies_interests_dict["socializing"] = getRandomIntInclusive(1, 5);

        bcrpyt.hash(password, 12).then(hashedPassword => {
            const user = new User({
                firstName: firstName,
                lastName: lastName,
                password: hashedPassword,
                phoneNumber: phoneNumber,
                email: email,
                movie: movie_dict,
                music: music_dict,
                hobbies_interests: hobbies_interests_dict
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
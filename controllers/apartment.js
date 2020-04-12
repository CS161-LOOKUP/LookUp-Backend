const {validationResult} = require('express-validator');
const fs = require('fs');
const path = require('path');

const Apartment = require('../model/apartment');
const User = require('../model/user');

//GET routes

//Description: Gets all the listings.
exports.getPosts = (req, res, next) => {
    Apartment.find().then(result => {
        res.status(200).json({
            message: "Fetched all the listings.",
            post: result
        });
    }).catch( err => {
        res.status(500).json({
            message: "Found no listings available.",
            err: err
        });
    });
};

//Description: Get all the apartments based on the token.
exports.getApartmentsByToken = (req, res, next) => {
    Apartment.find({user: req.userId})
    .then(apartments => {
        if(!apartments) {
            const error = new Error("No user found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            apartments: apartments
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

//Description: Get all the apartments a user by their ID.
exports.getApartmentsOfUser = (req, res, next) => {
    Apartment.find({user: req.body.userId})
    .then(apartments => {
        if(!apartments) {
            const error = new Error("No user found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            apartments: apartments
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

//Description: Gets all the listings based on an ID.
exports.getPostByID = (req, res, next) => {
    Apartment.findById(req.params.apartmentId)
    .then(result => {
        if(!result) {
            const error = new Error("Could not find apartment");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: "Fetched a post based on ID",
            post: result
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

//POST routes
exports.createPost = (req, res, next) => {
    if(!validationResult(req).isEmpty) {
        return res.status(422).json({message: "Validation Failed, entered data is incorrect."});
    }

    if(!req.file) {
        const error = new Error("No image found");
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageURL = req.file.path;
    const apartment = new Apartment({
        title: title,
        description: description,
        price: price,
        imageURL: imageURL,
        user: req.userId
    });
    apartment.save()
    .then(createdApartment => {
        return User.findById(req.userId);
    }).then(user => {
        user.posts.push(apartment);
        return user.save();
    }).then(updatedUser => {
        res.status(201).json({
            message: "Apartment created succesfully!",
            post: apartment,
            user: updatedUser._id
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err); 
    });
}; 

//PUT routes
exports.updateByID = (req, res, next) => {
    let apartmentId = req.params.apartmentId;
    if(!validationResult(req).isEmpty) {
        return res.status(422).json({message: "Validation Failed, entered data is incorrect."});
    }
    let title = req.body.title
    let description = req.body.description
    let price = req.body.price
    let imageURL = req.body.imageURL
    if (req.file) {
        imageURL = req.file.path;
    }
    if(!imageURL){
        const error = new Error("No file picked");
        error.statusCode = 422;
        throw error;
    }

    Apartment.findById(apartmentId).then(apartment => {
        if(!apartment) {
            const error = new Error("Could not find apartment");
            error.statusCode = 404;
            throw error;
        }
        if(apartment.user.toString() !== req.userId){
            const error = new Error("Not Authorized");
            error.statusCode = 403;
            throw error;
        }
        if(imageURL != apartment.imageURL) {
            deleteImage(apartment.imageURL);
        }
        apartment.title = title;
        apartment.price = price;
        apartment.description = description;
        apartment.imageURL = imageURL;
        return apartment.save();
    }).then(result => {
        res.status(200).json({
            message: "Apartment updated!",
            apartment: result
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

const deleteImage = filePath => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, err => console.log(err));
};

//Delete routes
exports.deleteByID = (req, res, error) => {
    Apartment.findById(req.params.apartmentId).then(apartment => {
        if(!apartment) {
            const error = new Error("Could not find apartment");
            error.statusCode = 404;
            throw error;
        }
        if(apartment.user.toString() !== req.userId){
            const error = new Error("Not Authorized");
            error.statusCode = 403;
            throw error;
        }
        deleteImage(apartment.imageURL);
        return Apartment.findByIdAndRemove(req.params.apartmentId);
    }).then(result => {
        return User.findById(req.userId);
    }).then(user => {
        user.posts.pull(req.params.apartmentId);
        return user.save();
    }).then(updatedUser => {
        res.status(200).json({
            message: "Deleted apartment"
        });
    }).catch(error => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
const express = require("express");
const mongoose = require("mongoose");
const apartmentRoutes = require("./routes/apartment");
const bodyParser = require("body-parser");
const multer = require("multer");

const expressApp = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    }
});

//Accepted files for images
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

expressApp.use(bodyParser.json());
expressApp.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

//To avoid CORS error.
expressApp.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

expressApp.use("/apartment", apartmentRoutes);

expressApp.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({
        message: message
    });
});

mongoose
.connect("mongodb+srv://Charan:ygdl9uFbDZEcjGQs@lookup-lrrqs.mongodb.net/LookUp?retryWrites=true&w=majority", {useUnifiedTopology: true, useNewUrlParser: true})
.then(result => {
    console.log("Connected to MongoDB!");
    expressApp.listen(8080);
}).catch(err => {
    console.log("Connection to MongoDB failed.");
});
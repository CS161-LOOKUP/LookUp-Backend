const express = require('express');
const { body } = require('express-validator');
const authController = require("../controllers/auth");
const User = require("../model/user");
const router = express.Router();

//GET /user/getUsers
router.get("/getUsers", authController.getUsers);

//POST /user/createUser
//Description: Create a user
router.post("/createUser", [
    body("email").isEmail().withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
        return User.findOne({email: value}).then(user => {
            if (user) {
                return Promise.reject("E-mail address already exists!");
            }
        });
    }).normalizeEmail(),
    body("password").trim().isLength({min: 5}),
    body("firstName").trim().not().isEmpty(),
    body("lastName").trim().not().isEmpty(),
    body("interests").not().isEmpty()
], authController.signUp);

module.exports = router;
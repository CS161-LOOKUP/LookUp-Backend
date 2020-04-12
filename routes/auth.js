const express = require('express');
const { body } = require('express-validator');
const authController = require("../controllers/auth");
const User = require("../model/user");
const isAuth = require("../middleware/isAuth");
const router = express.Router();

//GET /user/getAllUsers
//Description: Get all the users
router.get("/getAllUsers", isAuth, authController.getUsers);

//GET /user/:userId
//Description: Get user by Id
router.get("/getUser/:userId", isAuth, authController.getUserById);

//GET /user/getFavorite
//Description: Get all the favorite apartments ID a user has. This user is based
//on the JWT userId.
router.get("/getFavorite", isAuth, authController.getFavorite);

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

//POST /user/login
//Description: Log a user in.
router.post("/login", authController.login);

//POST /user/logout
//Description: Log a user out.
router.post("/logout", isAuth);

//PUT /user/addFavorite
//Description: Add a apartment to the user favorite list based on the
//apartment ID. Body should contain, apartmentId field.
router.put("/addFavorite", isAuth, authController.addFavorite);

module.exports = router;
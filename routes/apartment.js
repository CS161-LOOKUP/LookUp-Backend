const express = require("express");
const {body} = require('express-validator');
const apartmentController = require("../controllers/apartment");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

//GET /apartment/posts
//Description: Gets all the listings
router.get('/posts', isAuth, apartmentController.getPosts);

//GET /apartment/:apartmentId
//Description: Get a apartment post based on the ID.
router.get('/post/:apartmentId', isAuth, apartmentController.getPostByID);

//GET /apartment/userID
//Description: Get all the apartments a user has by passing in a user ID.
router.get('/userId', isAuth, apartmentController.getApartmentsOfUser);

//POST /apartment/createpost
//Description: Create a post made by the user, this route doesn't use JSON in frontend
//instead should use Form data because we need to upload an image.
router.post("/createpost", isAuth, [
    body('title').trim().isLength({min: 1}),
    body('description').trim().isLength({min: 1})
], apartmentController.createPost);

//PUT /apartment/update/:apartmentId
//Description: Updates a existing post. Need to send imagePath if user didn't select a new image.
//Route doesn't use JSON also, since image could be changed. 
router.put("/update/:apartmentId", isAuth, [
    body('title').trim().isLength({min: 1}),
    body('description').trim().isLength({min: 1})
], apartmentController.updateByID)

//DELETE /apartment/delete/:apartmentId
//Description: Delete's a apartment based on ID.
router.delete("/delete/:apartmentId", isAuth, apartmentController.deleteByID);

module.exports = router;  
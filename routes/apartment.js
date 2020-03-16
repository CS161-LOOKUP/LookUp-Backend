const express = require("express");
const {body} = require('express-validator');
const apartmentController = require("../controllers/apartment");

const router = express.Router();

//GET /apartment/posts
//Description: Gets all the listings
router.get('/posts', apartmentController.getPosts);

//GET /apartment/:apartmentId
//Description: Get a apartment post based on the ID.
router.get('/post/:apartmentId', apartmentController.getPostByID);

//POST /apartment/createpost
//Description: Create a post made by the user, this route doesn't use JSON in frontend
//instead should use Form data because we need to upload an image.
router.post("/createpost", [
    body('title').trim().isLength({min: 1}),
    body('description').trim().isLength({min: 1})
], apartmentController.createPost);

//PUT /apartment/update/:apartmentId
//Description: Updates a existing post. Route doesn't use JSON also, since image could be changed. 
router.put("/update/:apartmentId", [
    body('title').trim().isLength({min: 1}),
    body('description').trim().isLength({min: 1})
], apartmentController.update)

module.exports = router;  
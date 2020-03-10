const express = require("express");
const {body} = require('express-validator');
const apartmentController = require("../controllers/apartment");

const router = express.Router();

//GET /apartment/posts
//Description: Gets all the listings
router.get('/posts', apartmentController.getPosts);

//GET /apartment/:postId
//Description: Get a apartment post based on the ID.
router.get('/post/:postId', apartmentController.getPostByID);

//POST /apartment/createpost
//Description: Create a post made by the user, this route doesn't shouldn't use JSON in frontend
//instead should use Form data because we need to upload an image.
router.post("/createpost", [
    body('title').trim().isLength({min: 1}),
    body('description').trim().isLength({min: 1})
], apartmentController.createPost);

module.exports = router;  
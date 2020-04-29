const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    email: {type: String, required: true},
    music: {},
    movie: {},
    hobbies_interests: {},
    favorite: [{type: Schema.Types.ObjectId, ref: "Apartment"}]
});

module.exports = mongoose.model("User", userSchema);

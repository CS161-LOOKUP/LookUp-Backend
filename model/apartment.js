const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    imageURL: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model("Apartment", apartmentSchema);
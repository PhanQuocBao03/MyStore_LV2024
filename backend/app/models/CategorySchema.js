const mongoose = require('mongoose');

// Định nghĩa Schema cho Category
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    group:{
        type:String,
        required:true
    },
    photo: { type: String,required:true },
});


const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;

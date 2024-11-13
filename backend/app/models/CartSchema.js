const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({

    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1']
        },
    }],
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},{ timestamps: true });
CartSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name address phone'
    }).populate({
        path: 'products.product',
        select: 'name price size color discount photo'
    }); // Thay đổi đây để populate đúng
    next();
});

const CartModel = mongoose.model('Cart', CartSchema);
module.exports = CartModel;
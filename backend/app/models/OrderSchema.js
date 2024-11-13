const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type:String,
    },
    phone: {type:String},
    address:{type:String},
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
        }
    }],
    orderID: {
        type: String,
        required: true
    },
    salePrice:{
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        default: ''
    },
    payment:{
        type:String,
        enum:['COD','Đã thanh toán'],
        default:'COD'
    },
    status: {
        type: String,
        enum: ['Đang xử lý','Chờ vận chuyển', 'Chờ thanh toán', 'Đã hoàn tất', 'Đơn hủy'],
        default: 'Đang xử lý'
    }
});

// Populate user and products
OrderSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name address phone'
    }).populate({
        path:'products.product',
        select:'name photo manuFacture price discount type'
    }); // Thay đổi đây để populate đúng
    next();
});

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;

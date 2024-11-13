const mongoose = require('mongoose');

const StockOutSchema = new mongoose.Schema({
    _id:{type:String,require:true},
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',  // Giả sử có mô hình Employee
        required: true
    },
    employeeGive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',  // Giả sử có mô hình Employee
        required: true
    },
    
    products:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',  // Giả sử có mô hình Product
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1 // Số lượng phải lớn hơn 0
        },
        
        price: {
            type: Number,
            min: 1 // Số lượng phải lớn hơn 0
        },

    }],
    location: { // Lưu dạng object thay vì ObjectId
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',  // Giả sử có mô hình Product
        required: true
    },
    status: {
        type: String,
        enum: ['Đã hoàn tất', 'Chưa hoàn tất'],
        default: 'Chưa hoàn tất'
    },
    dateOut: {
        type: Date,
        default: Date.now // Mặc định là thời gian hiện tại
    },
    
}, {
    timestamps: true // Thêm timestamps cho thời gian tạo và cập nhật
});
StockOutSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'employee',
        select: 'name employeeId phone'
    }).populate({
        path: 'employeeGive',
        select: 'name employeeId phone' // Hạn chế thông tin employeeGive nếu cần
    }).populate({
        path: 'products.product',
        select: 'name photo manuFacture price'
    }).populate({
        path: 'location', // Sửa lỗi để populate đúng location
        select: 'zone rack pallet type level products'
    });;
    next();
});
const StockOutModel = mongoose.model("StockOut",StockOutSchema);
module.exports = StockOutModel;
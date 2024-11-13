const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  photo: { type: String },
  address: { type: String },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  point: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['on', 'off'],
    default: 'off',
  },
  gender: { type: String, enum: ["Nam", "Nữ", "Khác"] },
  bloodType: { type: String },
  lastActiveAt: { type: Date }, // Thời gian hoạt động cuối cùng
}, { timestamps: true }); // Tự động tạo `createdAt` và `updatedAt`

UserSchema.pre('save', function (next) {
  if (this.point) {
    this.point = Math.round(this.point);
  }
  next();
});



const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;

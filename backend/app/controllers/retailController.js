const Retail = require('../models/retailSchema');
const Product = require('../models/ProductSchema');
const UserModel = require('../models/UserSchema');
const PromotionModel = require('../models/PromotionSchema');

const createRetail = async (req, res) => {
    try {
        const { userId, employeeId, products, payment, totalAmountAfterDiscount, discount, totalSale, promotionId } = req.body;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Tạo đối tượng Retail mới
        const retail = new Retail({
            user: userId,
            employee: employeeId || null,
            salePrice: totalSale,
            totalAmount: totalAmountAfterDiscount,
            payment: payment || 'Tiền mặt',
            products: [] // Khởi tạo danh sách sản phẩm
        });

        // Tạo mảng các promise để tìm và kiểm tra sản phẩm
        const productPromises = products.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Sản phẩm ${product.name} không đủ tồn kho`);
            }

            // Trừ số lượng tồn kho
            product.stock -= item.quantity;
            await product.save();

            // Thêm sản phẩm vào đơn hàng
            retail.products.push({
                product: product._id,
                quantity: item.quantity
            });
        });

        // Kiểm tra voucher
        const promotion = await PromotionModel.findById(promotionId);
        if (promotion) {
            promotion.quantity -= 1; // Giảm số lượng voucher
            await promotion.save();
        }

        // Chờ tất cả promise hoàn thành
        await Promise.all(productPromises);
        if (totalAmountAfterDiscount > 0) {
            let userPoint = totalAmountAfterDiscount / 100; // 1 điểm cho mỗi 100 đơn vị tiền
            if (discount > 0) {
                userPoint -= discount; // Trừ điểm giảm giá nếu có
            }
            user.point += userPoint; // Cộng dồn điểm vào điểm hiện có của người dùng
            await user.save(); // Lưu thay đổi vào cơ sở dữ liệu
        }

        // Lưu đơn hàng vào cơ sở dữ liệu
        const savedRetail = await retail.save();

        res.status(201).json({
            message: 'Tạo đơn hàng thành công',
            data: savedRetail
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Lỗi máy chủ khi tạo đơn hàng',
            error: error.message || 'Có lỗi xảy ra'
        });
    }
};

const getRetail = async (req, res) => {
    try {
        const retail = await Retail.find();
        res.status(200).json({ data:retail });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Lỗi máy chủ khi lấy đơn hàng',
            error: error.message || 'Có lỗi xảy ra'
        });
    }
};

module.exports = { createRetail, getRetail };

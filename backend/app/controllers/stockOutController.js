const StockOutSModel = require("../models/StockOutSchema");
const ProductModel = require("../models/ProductSchema");
const LocationModel = require("../models/LocationSchema");
const moment = require('moment');

const createStockOut = async (req, res) => {
    try {
        const { products, employeeId, locationId,status, note, dateOut,employeeGive } = req.body;

        // Kiểm tra xem vị trí có tồn tại không
        const location = await LocationModel.findById(locationId);
        if (!location) {
            return res.status(404).json({ message: `Vị trí ${locationId} không tồn tại.` });
        }

        let stockOutProducts = [];
        const locationProductsMap = new Map(
            location.products.map(p => [p.product?._id.toString(), p])
        );

        for (const item of products) {
            const { productId, quantity, price } = item;

            // Kiểm tra xem sản phẩm có tồn tại không
            const product = await ProductModel.findById(productId);
            if (!product) {
                return res.status(404).json({ message: `Sản phẩm ${productId} không tồn tại.` });
            }

            // Kiểm tra xem vị trí có sản phẩm và đủ số lượng không
            const targetLocation = locationProductsMap.get(productId);
            if (!targetLocation || targetLocation.quantity < quantity ) {
                return res.status(409).json({
                    success: false,
                    message: `Sản phẩm ${productId} không tồn tại ở vị trí này hoặc vị trí không có đủ số lượng.`
                });
            }

            

            // Kiểm tra và giảm số lượng sản phẩm trong kho
            if (product.stock < quantity) {
                return res.status(409).json({
                    success: false,
                    message: `Số lượng sản phẩm ${productId} không đủ trong kho.`
                });
            }

            // Cập nhật số lượng sản phẩm
            stockOutProducts.push({ product: productId, quantity, location: targetLocation._id, price });
            product.stock -= quantity;
            targetLocation.quantity -= quantity;

            // Lưu thay đổi cho sản phẩm và vị trí
            await product.save();
        }

        const totalQuantity = stockOutProducts.reduce((sum, item) => sum + item.quantity, 0);

        // Tạo mã stockOut cho ngày hiện tại
        const today = moment().format('DDMMYY');
        const stockOutCount = await StockOutSModel.countDocuments({
            createdAt: { $gte: moment().startOf('day'), $lt: moment().endOf('day') }
        });
        const stockOutId = `X${(stockOutCount + 1).toString().padStart(3, '0')}/${today}`;

        // Tạo mới StockOut
        const newStockOut = new StockOutSModel({
            _id: stockOutId,
            employee: employeeId,
            employeeGive:employeeGive,
            products: stockOutProducts,
            quantity: totalQuantity,
            location:locationId,
            dateOut,
            status,

            note
        });

        // Lưu stockOut
        const savedStockOut = await newStockOut.save();
        if (!savedStockOut) {
            return res.status(409).json({ success: false, message: 'Xuất kho thất bại' });
        }

        // Lưu thay đổi cho location
        await location.save();

        res.status(200).json({ success: true, message: 'Xuất kho thành công', data: savedStockOut });
    } catch (error) {
        console.error("Lỗi máy chủ:", error.message);
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message || 'Có lỗi xảy ra' });
    }
};


const getStockOut = async (req, res) => {
    try {
        const stockOut = await StockOutSModel.find();
        res.status(200).json({ success: true, data: stockOut });
    } catch (error) {
        console.error("Lỗi máy chủ", error.message);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};
const getStockOutByIdLocation = async (req, res) => {
    try {
        const id = req.params.id;
        const stockOut = await StockOutSModel.find({location:id});
        res.status(200).json({ success: true, data: stockOut });
    } catch (error) {
        console.error("Lỗi máy chủ", error.message);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

module.exports = { createStockOut, getStockOut,getStockOutByIdLocation };

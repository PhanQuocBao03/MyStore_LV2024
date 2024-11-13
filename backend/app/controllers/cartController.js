const Cart = require('../models/CartSchema');
const Product = require('../models/ProductSchema');

const createCart = async (req, res) => {
    try {
        const { productId, userId, quantity} = req.body; // Thêm type vào các tham số nhận từ yêu cầu
        
        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: `Sản phẩm ${productId} không tồn tại!` });
        }

        // Kiểm tra số lượng yêu cầu có lớn hơn tồn kho không
        if (quantity > product.stock) {
            return res.status(400).json({ success: false, message: `Số lượng sản phẩm ${productId} không đủ!` });
        }

        // Kiểm tra xem giỏ hàng của người dùng đã tồn tại chưa
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Tạo giỏ hàng mới cho người dùng
            cart = new Cart({
                user: userId,
                products: [{ product: productId, quantity }] // Thêm sản phẩm và thông tin type vào mảng products
            });
        } else {
            // Nếu giỏ hàng đã tồn tại, kiểm tra xem sản phẩm có trong giỏ hàng chưa
            const productInCart = cart.products.find(item => item.product._id.toString() === productId );

            if (productInCart) {
                // Nếu sản phẩm đã có trong giỏ, cập nhật số lượng
                productInCart.quantity += quantity;
            } else {
                // Nếu sản phẩm chưa có trong giỏ, thêm sản phẩm mới vào giỏ
                cart.products.push({ product: productId, quantity });
            }
        }

        // Lưu lại giỏ hàng
        await cart.save();
        
        res.status(200);

    } catch (error) {
        console.error('Lỗi máy chủ:', error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};


const getAll = async (req, res) => {
    try {
        const { userId } = req.params; 
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Giỏ hàng không tìm thấy cho người dùng này.' });
        }

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error('Lỗi máy chủ:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const deleteOne = async (req, res) => {
    try {
        const { userId, productId } = req.params; // Lấy userId và productId từ params

        // Tìm giỏ hàng của người dùng
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Giỏ hàng không tìm thấy' });
        }

        // Tìm sản phẩm trong giỏ hàng
        const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại trong giỏ hàng' });
        }

        // Xóa sản phẩm khỏi giỏ hàng
        cart.products.splice(productIndex, 1);

        // Lưu giỏ hàng sau khi xóa sản phẩm
        await cart.save();

        res.status(200).json({ success: true, message: 'Sản phẩm đã xóa khỏi giỏ hàng thành công' });
    } catch (error) {
        console.error('Lỗi máy chủ:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};


const deleteAll = async (req, res) => {
    try {
        const { userId } = req.params;

        // Kiểm tra xem userId có được truyền vào hay không
        if (!userId) {
            return res.status(400).json({ success: false });
        }

        // Xóa tất cả các mục giỏ hàng của người dùng
        const result = await Cart.deleteMany({ user: userId });

        if (result.deletedCount === 0) {
            return res.status(404);
        }

        res.status(200);

    } catch (error) {
        console.error('Error deleting cart items:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
const updateCartItem = async (req, res) => {
    try {
        const { userId } = req.params; // Lấy userId và productId từ URL
        const { quantity, productId } = req.body; // Lấy số lượng mới từ body của yêu cầu

        if (quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Số lượng phải lớn hơn 0.' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại.' });
        }

        if (quantity > product.stock) {
            return res.status(400).json({ success: false, message: 'Số lượng sản phẩm không đủ.' });
        }

        // Tìm giỏ hàng của người dùng
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Giỏ hàng không tìm thấy.' });
        }

        // Tìm sản phẩm trong giỏ hàng của người dùng
        const productInCart = cart.products.find(item => item.product._id.toString() === productId);
        if (!productInCart) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không có trong giỏ hàng.' });
        }

        // Cập nhật số lượng sản phẩm trong giỏ
        productInCart.quantity = quantity;
        await cart.save();

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error('Lỗi máy chủ:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};


module.exports = { createCart, getAll,deleteOne,deleteAll,updateCartItem };


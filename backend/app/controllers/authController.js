const bcrypt = require('bcrypt');
const User = require('../models/UserSchema');
const Employee = require('../models/employeeSchema');
const Counter = require('../models/CounterSchema'); // Import mô hình Counter
const jwt = require('jsonwebtoken');

// Hàm tạo token JWT
const generateToken = user => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '15d' }
    );
};

// Hàm để lấy giá trị ID mới
const getNextSequenceValue = async (sequenceName) => {
    try {
        const sequenceDocument = await Counter.findByIdAndUpdate(
            { _id: sequenceName },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true } // Cập nhật và tạo mới nếu chưa có
        );
        return sequenceDocument.sequence_value;
    } catch (error) {
        console.error('Lỗi khi lấy giá trị tuần tự:', error);
        throw error;
    }
};


const register = async (req, res) => {
    const { email, password, name, role, photo, gender, address, phone } = req.body;

    try {
        let existingUser = null;

        // Kiểm tra người dùng đã tồn tại trong cơ sở dữ liệu
        if (role === 'user') {
            existingUser = await User.findOne({ email });
        } else if (role === 'employee') {
            existingUser = await Employee.findOne({ email });
        }

        // Nếu người dùng đã tồn tại, trả về lỗi
        if (existingUser) {
            return res.status(400).json({ message: 'Email hoặc người dùng đã tồn tại' });
        }

        // Băm mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser;

        // Tạo người dùng mới
        if (role === 'user') {
            newUser = new User({
                name,
                email,
                password: hashedPassword, // Sử dụng mật khẩu đã băm
                photo,
                address,
                phone,
                gender,
                role
            });
        } else if (role === 'employee') {
            const nextId = await getNextSequenceValue('employeeId');
            newUser = new Employee({
                name,
                email,
                password: hashedPassword, // Sử dụng mật khẩu đã băm
                photo,
                gender,
                address,
                phone,
                employeeId: `MS-${nextId}`,
                role
            });
        }

        // Lưu người dùng vào cơ sở dữ liệu
        await newUser.save();
        res.status(201).json({ success: true, message: 'Đăng ký thành công' });

    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ, vui lòng thử lại' });
    }
};

const login = async (req, res) => {
    const { email } = req.body;

    try {
        let user = null;
        const userInDb = await User.findOne({ email });
        const employeeInDb = await Employee.findOne({ email });
        
        if (userInDb) {
            user = userInDb;
        } else if (employeeInDb) {
            user = employeeInDb;
        }

        // Nếu không tìm thấy người dùng, trả về lỗi
        if (!user) {
            return res.status(404).json({ message: "Tài khoản không tồn tại" });
        }

        // Kiểm tra mật khẩu
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ status: false, message: 'Mật khẩu không đúng' });
        }

        // Cập nhật lastActiveAt và trạng thái online
        user.lastActiveAt = new Date();
        user.status = "on";
        await user.save();

        // Tạo token
        const token = generateToken(user);

        // Trả về thông tin người dùng
        const { password, role, ...rest } = user._doc;
        res.status(200).json({ status: true, message: 'Đăng nhập thành công', token, data: { ...rest }, role });
    } catch (error) {
        console.error('Lỗi đăng nhập phía server:', error);
        res.status(500).json({ status: false, message: 'Đăng nhập thất bại' });
    }
};
const logout = async (req, res) => {
    try {
        const { userId } = req.body;
        // Cập nhật status thành "off" cho người dùng khi đăng xuất
        await User.findByIdAndUpdate(userId, { status: "off",lastActiveAt: new Date() });

        res.status(200).json({ message: "Đăng xuất thành công" });
    } catch (error) {
        console.error('Lỗi đăng xuất:', error);
        res.status(500).json({ message: "Đăng xuất thất bại" });
    }
};



module.exports = { register, login,logout };

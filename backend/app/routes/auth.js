const express = require('express');
const { register,login, logout } = require('../controllers/authController'); // Đảm bảo đường dẫn chính xác

const router = express.Router();

router.post('/register', register).post('/login',login).put('/logout', logout);

module.exports = router;

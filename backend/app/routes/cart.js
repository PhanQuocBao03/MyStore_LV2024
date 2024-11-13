const express = require('express');
const {createCart, getAll, deleteAll, deleteOne, updateCartItem} = require('../controllers/cartController');

const router = express.Router();

router.post('/',createCart).get('/:userId',getAll).delete('/:userId/:productId', deleteOne).delete("/:userId",deleteAll).put("/:userId",updateCartItem);

module.exports = router;
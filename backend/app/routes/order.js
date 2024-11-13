const express = require('express');
const {
    createOrder,
    getOrder,
    getOneOrder,
    updateOrder,
    deleteOrder,
    deleteManyOrder,
    getOneOrderWithUserId
} = require('../controllers/orderController');

const router = express.Router();
router.post("/", createOrder);
router.get("/", getOrder);
router.get("/users/:userId", getOneOrderWithUserId);
router.get("/:id", getOneOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.delete("/", deleteManyOrder);

module.exports = router;

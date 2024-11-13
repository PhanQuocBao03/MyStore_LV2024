const express = require ('express');
const {createStockOut, getStockOut, getStockOutByIdLocation} =require("../controllers/stockOutController");

const router = express.Router();
router.post('/',createStockOut).get("/",getStockOut).get("/getLocationId/:id",getStockOutByIdLocation);
module.exports = router;

const express = require("express");

const {createProduct,updateProduct,getSingleProduct,getAllProduct,deleteProduct,deleteAllProduct, getProductWithCategoriesName}= require("../controllers/productController");

const router = express.Router();

router.post("/",createProduct)
        .put("/:id",updateProduct)
        .get("/category",getProductWithCategoriesName)
        .get("/:id",getSingleProduct)
        .get("/",getAllProduct)
        .delete("/:id",deleteProduct)
        .delete("/",deleteAllProduct)

module.exports = router;
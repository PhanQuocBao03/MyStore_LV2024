const Category = require("../models/CategorySchema");

const createCategory = async (req, res) => {
  try {
    const { name,group,photo } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Tên là bắt buộc" });
    }
    const existingCategory = await Category.findOne({ name,group,photo });
    if (existingCategory) {
      return res.status(409).json({ message: "Tên danh mục đã tồn tại" });
    }
    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();

    res.status(201).json({
      message: "Danh mục đã được tạo thành công",
      data: savedCategory,
    });
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};
const updateCategories = async(req,res)=>{
  try {
    const categories = await Category.findByIdAndUpdate(
        req.params.id, req.body, { 
            new: true, runValidators: true 
        });
    if (!categories) {
    return res.status(404).json({ error: 'Danh mục không tồn tại' });
    }
    res.status(200).json({success:true,message:"Cập nhật thành công",data:categories});
} catch (error) {
    res.status(400).json({ error: error.message });
}
}
const getOne = async(req,res)=>{
  try {
    const id = req.params.id;
    const categories = await Category.findById(id);
    res.status(200).json({success:true,data:categories});

    
  } catch (error) {
    res.status(500).json({ error: error.message });
    
  }
}
const getAll = async(req,res)=>{
    try {
      const {query}=req.query;
      let categorys;
      if(query){
        categorys = await Category.find({ name: { $regex: query, $options: 'i' } })
      }else{
        categorys = await Category.find();
      }
        res.status(200).json({success:true,data:categorys})
    } catch (error) {
    res.status(500).json({ error: error.message });
        
    }
}
const deleteMany = async(req,res)=>{
  try {
    const { _id } = req.body; // Lấy _id từ req.body
    if (!Array.isArray(_id) || _id.length === 0) {
        return res.status(400).json({ success: false, error: 'Không có ID danh mục nào được cung cấp!' });
    }

    const result = await Category.deleteMany({ _id: { $in: _id } }); // Sử dụng toán tử $in để xóa nhiều ID
    
    if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy danh mục nào để xóa!' });
    }

    res.status(200).json({ success: true, message: "Đã xóa danh mục thành công", deletedCount: result.deletedCount });
} catch (error) {
    res.status(500).json({ success: false, error: error.message }); // Trả về mã lỗi 500 cho lỗi máy chủ
}
}
module.exports = { createCategory,getAll,deleteMany,updateCategories,getOne };

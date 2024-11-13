import { useState } from "react";
import { BASE_URL } from "../../../../config";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import useFetchData from "../../../Hook/userFecthData";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaEdit, FaTrash } from "react-icons/fa";
import DeleteCategoriesDialog from "./deleteCategoriesDialog";
import EditCategoriesDialog from "./editCategoriesDialog";
import whouse from '../../../assets/images/whouse.png';



const Category = () => {
    const { data: category } = useFetchData(`${BASE_URL}/category`);
    const [formData, setFormData] = useState({ name: '' });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [checked, setChecked] = useState({});
    const [selectedIds, setSelectedIds] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);




    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;


    const currentItems = category.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(category.length / itemsPerPage);
    const handleSelectChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'allSelect') {
            const updatedChecked = {};
            currentItems.forEach(item => {
                updatedChecked[item._id] = checked;
            });
            setChecked(updatedChecked);
        } else {
            setChecked(prev => ({
                ...prev,
                [name]: checked
            }));
        }
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const selectedCategoryIds = Object.keys(checked).filter(id => checked[id]);
    const handleOpenDelete = () => {
        if (selectedCategoryIds.length > 0) {
            setSelectedIds(selectedCategoryIds);
            setOpenDialog(true);
        } else {
            toast.warn("Hãy chọn đơn hàng bạn muốn xóa!");
        }
    };
    const handleCloseDelete = () => {
        setOpenDialog(false);
        setSelectedIds([]);
    };

    const handelInputChange = e => {
        setFormData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    }
    const handleOpenEdit = (id) => {
        setOpenEdit(true);
        setSelectedIds(id);
    }
    const handleCloseEdit = () => {
        setOpenEdit(false);
        setSelectedIds([]);
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const { message } = await response.json();
            if (!response.ok) {
                throw new Error(message);
            }
            toast.success(message);
            navigate('/warehouse');
        } catch (error) {
            toast.error(`Lỗi: ${error.message}`);


        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="text-left p-5 w-1/3 flex gap-2 cursor-pointer">
                <img src={whouse} className="w-6 h-6" alt="" />
                <Link to={`/warehouse`} className="heading w-[150px]">Quản lý Kho</Link>
                
            </div>
            <div className=" text-center items-center">

                <h1 className="heading">Thêm danh mục mới</h1>
            </div>
            <div className="mt-3">
                <form action="" onSubmit={submitHandler}>
                    <div className=" grid grid-cols-9 gap-2 w-1/2 items-center  mx-auto">
                        <p className="form__label col-span-2">Tên danh mục: </p>
                        <input name="name" onChange={handelInputChange} value={formData.name} type="text" placeholder="Nhập tên danh mục mới.." className="border-2 py-3 px-2  border-solid rounded-lg focus:outline-none col-span-5" />
                        <button disabled={loading} type="submit" className="border-2 py-3 border-solid text-white border-slate-300 shadow-md rounded-lg bg-primaryColor col-span-1">
                            {loading ? <HashLoader size={35} color="#ffffff" /> : 'Thêm'}
                        </button>
                    </div>
                </form>
            </div>
            <div className="mt-3">
                <div className="ml-3 mb-3">


                    <h2 className="heading text-center">Danh sách danh mục</h2>

                    <div className="alative">
                        <div className="absolute right-[410px] top-[277px]">
                            <button
                                className={`${selectedCategoryIds.length > 0
                                    ? 'border rounded-xl mr-5 flex gap-2 text-center border-solid p-2 bg-red-500 text-white '
                                    : 'hidden'}`}
                                onClick={handleOpenDelete}
                            >
                                <FaTrash className="mt-1" />
                                <span>Xóa</span>
                            </button>

                        </div>
                        <div className="flex justify-center items-center">
                            <table className="w-2/3 mt-5 text-sm text-center border-2 border-slate-300">
                                <thead className="text-xs uppercase border-b-2 border-b-slate-300">
                                    <tr>
                                        <th scope="col">
                                            <input
                                                type="checkbox"
                                                name="allSelect"
                                                checked={Object.keys(checked).length === currentItems.length && currentItems.every(item => checked[item._id])}
                                                onChange={handleSelectChange}
                                            />
                                        </th>
                                        <th scope="col">STT</th>
                                        <th scope="col">Hình</th>

                                        <th scope="col">Tên</th>
                                        <th scope="col">Nhóm</th>
                                        <th scope="col">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems?.map((items, index) => (
                                        <tr key={index} className="text-[16px] text-center">
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={checked[items._id] || false}
                                                    name={items._id}
                                                    onChange={handleSelectChange}
                                                />
                                            </td>
                                            <td className="pr-3 py-4">{index + 1}</td>
                                            <td className="pr-3 py-4 w-8">
                                                <img src={items.photo} alt="" />
                                            </td>
                                            <td className="pr-3 py-4">{items.name}</td>
                                            <td className="pr-3 py-4">{items.group}</td>
                                           
                                            <td className="pr-3 py-4 cursor-pointer" onClick={() => handleOpenEdit(items._id)}><FaEdit /> </td>

                                        </tr>))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="mx-1 px-3 py-1 rounded-lg bg-gray-300 text-gray-700"
                            >
                                <FaAngleDoubleLeft />
                            </button>
                            {currentPage > 2 && (
                                <>
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        className="mx-1 px-3 py-1 rounded-lg bg-gray-300 text-gray-700"
                                    >
                                        1
                                    </button>
                                    <span>...</span>
                                </>
                            )}

                            {/* Các nút trang hiện tại, trước và sau */}
                            {Array.from({ length: totalPages }, (_, i) => {
                                if (i + 1 === currentPage || i + 1 === currentPage - 1 || i + 1 === currentPage + 1) {
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`mx-1 px-3 py-1 rounded-lg ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                }
                                return null; // Không hiển thị nút cho các trang không liên quan
                            })}

                            {/* Nút trang cuối cùng */}
                            {currentPage < totalPages - 1 && (
                                <>
                                    <span>...</span>
                                    <button
                                        onClick={() => handlePageChange(totalPages)}
                                        className="mx-1 px-3 py-1 rounded-lg bg-gray-300 text-gray-700"
                                    >
                                        {totalPages}
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="mx-1 px-3 py-1 rounded-lg bg-gray-300 text-gray-700"
                            >
                                <FaAngleDoubleRight />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <DeleteCategoriesDialog
                categoriesIds={selectedIds}
                open={openDialog}
                handleClose={handleCloseDelete}
                size='lg'
                position='center'
                animate={{
                    mount: { x: 1, y: 0 },
                    unmount: { x: 0.9, y: -100 }
                }}

            />
            <EditCategoriesDialog
                categoriesIds={selectedIds}
                open={openEdit}
                handleClose={handleCloseEdit}
                size='lg'
                position='center'
                animate={{
                    mount: { x: 1, y: 0 },
                    unmount: { x: 0.9, y: -100 }
                }}

            />

        </div>
    );
}

export default Category;

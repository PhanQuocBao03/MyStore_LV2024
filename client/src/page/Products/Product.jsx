/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// // import ProductTable from "./ProductTable";
// import Loading from "../../components/Loader/Loading";
// import Error from "../../components/Error/Error";
import useFetchData from "../../Hook/userFecthData";
import { BASE_URL } from "../../../config";
import { FaSearch, FaTrash } from "react-icons/fa";
import filterIcon from "../../assets/images/filterIcon.png";
import { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import ProductAddDialog from "./ProductAddDialog";
import CategoryAddDialog from "./categoryAddDialog";
import ManuFactureAddDialog from "./manuFactureAddDialog";
import ProductDetail from "./productDetail";
import ProductDeleteDialog from "./productDeleteDialog";
import { toast } from "react-toastify";
import { BiSort } from "react-icons/bi";
// import FormatPrice from "../../utils/formatPrice";
import ProductAddOrder from "./productAddOrder";
import { useNavigate } from "react-router-dom";


const Product = () => {
    const [query, setQuery] = useState('');
    const [openProductAdd, setOpenProductAdd] = useState(false);
    const [openCategoryAdd, setOpenCategoryAdd] = useState(false);
    const [openManuFactureAdd, setOpenManuFactureAdd] = useState(false);
    const [debounceQuery, setDebounceQuery] = useState('');
    const [debounceCategory, setDebounceCategory] = useState('');
    const [debounceManuFacture, setDebounceManuFacture] = useState('');

    // Fetch data with debounced values
    const { data: product } = useFetchData(
        `${BASE_URL}/product?query=${debounceQuery}&categoryName=${debounceCategory}&manuFactureName=${debounceManuFacture}`
    );
    const { data: category } = useFetchData(`${BASE_URL}/category`);
    const { data: manuFacture } = useFetchData(`${BASE_URL}/manuFacture`);
    

    // Handle dialog open/close
    // const handleOpenProductAdd = () => setOpenProductAdd(true);
    const handleCloseProductAdd = () => setOpenProductAdd(false);

    const handleOpenCategoryAdd = () => setOpenCategoryAdd(true);
    const handleCloseCategoryAdd = () => setOpenCategoryAdd(false);
    const handleOpenManuFacture = () => setOpenManuFactureAdd(true);
    const handleCloseManuFactureAdd = () => setOpenManuFactureAdd(false);

    // Debounce search query
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceQuery(query);
            setDebounceCategory(category);
            setDebounceManuFacture(manuFacture);
        }, 900);
        return () => clearTimeout(timeout);
    }, [query, category, manuFacture]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState('name'); // 'name' hoặc 'price'
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' hoặc 'desc'
    const [checkedProducts, setCheckedProducts] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [addOrder,setAddOrder] = useState([])




    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(product.length / itemsPerPage);

    // Sắp xếp sản phẩm
    const sortedProducts = [...product].sort((a, b) => {
        let comparison = 0;

        // Sắp xếp theo tên sản phẩm
        if (sortOrder === 'name') {
            comparison = a.name.localeCompare(b.name);
        }
        // Sắp xếp theo giá
        else if (sortOrder === 'price') {
            comparison = a.type[0].price - b.type[0].price; // Giả sử ta sắp xếp theo giá của loại đầu tiên
        }
        // Sắp xếp theo số lượng
        else if (sortOrder === 'stock') {
            comparison = a.type[0].stock - b.type[0].stock; // Giả sử ta sắp xếp theo số lượng của loại đầu tiên
        }

        return sortDirection === 'asc' ? comparison : -comparison;
    });

    const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const handleSortChange = (newSortOrder) => {
        if (sortOrder === newSortOrder) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortOrder(newSortOrder);
            setSortDirection('asc'); // Reset hướng sắp xếp khi thay đổi cột
        }
    };
    const handleSelectChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'allSelect') {
            const updatedCheckedProducts = {};
            currentItems.forEach(item => {
                updatedCheckedProducts[item._id] = checked;
            });
            setCheckedProducts(updatedCheckedProducts);
        } else {
            setCheckedProducts(prev => ({
                ...prev,
                [name]: checked
            }));
        }
    };
    const selectedProductIds = Object.keys(checkedProducts).filter(id => checkedProducts[id]);

    const handleOpenDelete = () => {
        if (selectedProductIds.length > 0) {
            setSelectedIds(selectedProductIds);
            setOpenDialog(true);
        } else {
            toast.warn("Hãy chọn đơn hàng bạn muốn xóa!");
        }
    };

    const handleCloseDelete = () => {
        setOpenDialog(false);
        setSelectedIds([]);
       
    };
     // Get the user._id from the stored object

    const handleSelectId = async (id) => {
        setSelectedIds(id);
        setAddOrder(null);
        
        try {
            const token = localStorage.getItem('token'); // Lấy token từ localStorage
            const userData = JSON.parse(localStorage.getItem('user')); // Parse stored user object
            const userId = userData?._id;
    
            // Kiểm tra userId và token
            if (!userId || !token) {
                throw new Error('User ID or token is missing');
            }
    
            const res = await fetch(`${BASE_URL}/cart/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
    
            const result = await res.json();
    
            if (!res.ok) {
                throw new Error(result.message); // Ném lỗi nếu phản hồi không thành công
            }
            toast.success(result.message);
    
        } catch (error) {
            toast.error(error.message); // Hiển thị thông báo lỗi cho người dùng
        }
    


    };
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleAddOrder = async (id) => {
        setAddOrder(id);
        setSelectedIds(null);
        setLoading(true);
    
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            const userId = userData?._id;
    
            if (!userId) {
                throw new Error('User not found, please login again');
            }
    
            const response = await fetch(`${BASE_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, productId: id, quantity: 1 })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add order');
            }
    
            const { message } = await response.json();
            toast.success(message);
            navigate('/product')
            
        } catch (error) {
            toast.error(error.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };
    
    
    
    

    

    return (
        <>
            <div className="grid grid-cols-12">
                <div className="col-span-9">


                    <div className="py-0 px-5 pt-4 grid grid-cols-8">
                        <div className="text-left col-span-3">
                            <h2 className="heading">Quản lý Sản phẩm</h2>
                        </div>
                        <div className="col-span-5">
                            <div className="relative w-full max-w-lg">
                                <input
                                    type="search"
                                    placeholder="Tìm kiếm..."
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    className="w-full p-2 pl-10 border rounded-xl border-gray-300 focus:outline-none"
                                />
                                <button className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                                    <FaSearch />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        {/* <div className="ml-1 mb-3">
                    <button
                        onClick={handleOpenProductAdd}
                        className="mx-4 btn focus:outline-none flex items-center border rounded-md py-2 px-2 gap-1"
                        aria-label="Add Product"
                    >
                        <FaPlusCircle />
                        <span className="font-semibold text-[18px]">Thêm</span>
                    </button>
                </div> */}
                        <div className="flex justify-between items-center gap-8 mr-8 mt-5 pb-0">
                            <div className="flex gap-2">

                                <button onClick={handleOpenCategoryAdd}>
                                    <FaPlusCircle />
                                </button>
                                <select
                                    name="category"
                                    onChange={e => setDebounceCategory(e.target.value)}
                                    className="text-textColor font-semibold text-[15px] cursor-pointer leading-7 px-4 py-2 focus:outline-none border border-slate-500 rounded-lg"
                                >
                                    <option value="">Danh mục</option>
                                    {category.map(item => (
                                        <option key={item._id} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}

                                </select>
                            </div>
                            <div className="flex gap-2" >
                                <button onClick={handleOpenManuFacture}>
                                    <FaPlusCircle />
                                </button>


                                <select
                                    name="manuFacture"
                                    onChange={e => setDebounceManuFacture(e.target.value)}
                                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-2 focus:outline-none border border-slate-500 rounded-lg"
                                >
                                    <option value="">Hãng</option>
                                    {manuFacture.map(item => (
                                        <option key={item._id} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </div>
                    <section className="p-0">
                        <div className="mt-1">
                            <div className="relative">

                                <div className="flex mx-5 absolute -top-[61px]">
                                    <button
                                        className={`${selectedProductIds.length > 0
                                            ? 'border rounded-xl mr-5 flex gap-2 text-center border-solid p-2 bg-red-500 text-white '
                                            : 'hidden'}`}
                                        onClick={handleOpenDelete}
                                    >
                                        <FaTrash className="mt-1" />
                                        <span>Xóa</span>
                                    </button>
                                </div>
                                <div className="m-5 mr-2 ">

                                    <table className="w-full text-sm text-center border-2 border-slate-400">
                                        <thead className="text-xs uppercase border-2 border-slate-400 ">
                                            <tr>
                                                <th scope="col">
                                                    <input
                                                        type="checkbox"
                                                        name="allSelect"
                                                        checked={Object.keys(checkedProducts).length === currentItems.length && currentItems.every(item => checkedProducts[item._id])}
                                                        onChange={handleSelectChange}
                                                    />
                                                </th>
                                               
                                                <th scope="col" className="   border-2 border-slate-400">
                                                    <div className="flex gap-x-4">

                                                        <p className="text-[14px] font-semibold ">Tên sản phẩm</p>
                                                        <div
                                                            onClick={() => handleSortChange('name')}
                                                            className="cursor-pointer text-center text-[18px]"
                                                        >
                                                            {sortOrder === 'name' ? (sortDirection === 'asc' ? <BiSort /> : <div className="text-primaryColor">
                                                                <BiSort />
                                                            </div>) : <BiSort />}
                                                        </div>
                                                    </div>
                                                </th>
                                                <th scope="col" className=" py-3 border-2 border-slate-400 text-[14px] text-center">Màu</th>
                                                <th scope="col" className=" py-3 border-2 border-slate-400 text-[14px] text-center">Kích thước</th>
                                                <th scope="col" className=" py-3 border-2 border-slate-400 text-[14px] text-center">Số lượng</th>
                                                <th scope="col" className=" py-3 border-2 border-slate-400 text-[14px] text-center">Giá</th>


                                                <th scope="col" className=" py-3 border-2 border-slate-400 text-[14px] text-center">
                                                    Danh mục
                                                </th>
                                                <th scope="col" className=" py-3 border-2 border-slate-400 text-[14px] text-center">
                                                    Hãng
                                                </th>
                                                <th scope="col" className=" py-3 border-2 border-slate-400 text-[14px] text-center">Kho</th>

                                            </tr>
                                        </thead>
                                        <tbody className="bg-slate-50">
                                            {currentItems.map((item) => (
                                                <tr key={item._id} className="text-[16px] text-center relative ">
                                                    <td className="border-r-2 border-slate-400 pr-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={checkedProducts[item._id] || false}
                                                            name={item._id}
                                                            onChange={handleSelectChange}
                                                        />
                                                    </td>
                                                    <td className="pr-3 border-r-2 border-slate-400" onClick={() => handleSelectId(item._id)}>{item.name}</td>
{/* 
                                                    <td className=" p-0 pr-0 m-0" onClick={() => handleSelectId(item._id)}>
                                                        {item.type.map((typeItem, index) => (
                                                            <div key={`${item._id}-${index}`} className="grid grid-cols-4  items-center text-center justify-center">
                                                                <div className="flex items-center border-r-2 border-slate-400 border-b-2 p-2 justify-center w-full"> <div
                                                                    style={{
                                                                        backgroundColor: typeItem.color || 'transparent',
                                                                        width: '50px',
                                                                        height: '20px', 
                                                                    }}
                                                                ></div></div>
                                                                <span className="flex items-center border-r-2 border-slate-400 border-b-2 p-2 justify-center w-full" onClick={() => handleSelectId(item._id)}>{typeItem.size}</span>
                                                                <span className="flex items-center border-r-2 border-slate-400 border-b-2 p-2 justify-center w-full" onClick={() => handleSelectId(item._id)}>{typeItem.stock}</span>
                                                                <span className="flex items-center   border-slate-400 border-b-2 p-2  justify-center" onClick={() => handleSelectId(item._id)}>{FormatPrice(typeItem.price)}</span>
                                                            </div>
                                                        ))}
                                                    </td> */}
                                                    <td className=" border-x-2 border-slate-400 text-center items-center min-w-24" onClick={() => handleSelectId(item._id)}>
                                                        <div
                                                        className="border-2 w-14 h-6 border-black mx-auto"
                                                            style={{backgroundColor:item.color}}
                                                        ></div>
                                                        
                                                    </td>
                                                    <td className=" border-x-2 border-slate-400 text-center items-center min-w-24" onClick={() => handleSelectId(item._id)}>{item.size}</td>
                                                    <td className=" border-x-2 border-slate-400 items-center min-w-24" onClick={() => handleSelectId(item._id)}>{item.stock}</td>
                                                    <td className=" border-x-2 border-slate-400 items-center min-w-24" onClick={() => handleSelectId(item._id)}>{item.price}</td>
                                                    <td className=" border-x-2 border-slate-400 items-center min-w-24" onClick={() => handleSelectId(item._id)}>{item.category.name}</td>
                                                    <td className=" border-r-2 border-slate-400 items-center" onClick={() => handleSelectId(item._id)}>{item.manuFacture.name}</td>
                                                    <td className=" border-r-2 border-slate-400 items-center" onClick={() => handleSelectId(item._id)}>{item.location?.rack}L{item.location?.level}</td>
                                                    <td className="p-3 text-[16px] font-semibold cursor-pointer" onClick={()=>handleAddOrder(item._id)}>+</td>


                                                </tr>
                                            ))}
                                        </tbody>



                                    </table>
                                </div>
                                <div className="flex justify-center mt-4">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`mx-1 px-3 py-1 rounded-lg ${currentPage === i + 1
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-300 text-gray-700"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </section>
                </div>
                <div className="col-span-3 p-2 border-l-2 border-0 border-slate-300 shadow-lg rounded-md">
        {selectedIds?.length > 0 ? (
            <ProductDetail productId={selectedIds} />
        ) : (
            <ProductAddOrder   />
        )}
    </div>

            </div>
            <ProductAddDialog
                open={openProductAdd}
                handleClose={handleCloseProductAdd}
                size="lg"
                position="center"
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
            />
            <CategoryAddDialog
                open={openCategoryAdd}
                handleClose={handleCloseCategoryAdd}
                size="lg"
                position="center"
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
            />
            <ManuFactureAddDialog
                open={openManuFactureAdd}
                handleClose={handleCloseManuFactureAdd}
                size="lg"
                position="center"
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
            />
            <ProductDeleteDialog
                productId={selectedIds}
                open={openDialog}
                handleClose={handleCloseDelete}
                size='lg'
                position='center'
                animate={{
                    mount: { x: 1, y: 0 },
                    unmount: { x: 0.9, y: -100 }
                }}
            />
        </>
    );
}

export default Product;

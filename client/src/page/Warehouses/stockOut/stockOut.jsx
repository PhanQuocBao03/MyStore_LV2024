
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import SaveIcon from "../../../assets/images/saveIcon.png";
import CategoryIcon from "../../../assets/images/category2.png";
import { useCallback,useMemo, useState } from "react";
import { BASE_URL } from "../../../../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BiPlus, BiPrinter } from "react-icons/bi";
import Inventory from "../inventory/inventory";
import useFetchData from "../../../Hook/userFecthData";
import { AiOutlineDelete } from "react-icons/ai";
import PrintStockOut from "./printStockOut";

const StockOut = ({ handleClose, locations, stockIns }) => {
    const { data: employees } = useFetchData(`${BASE_URL}/employee`);
    const { data: stockOuts } = useFetchData(`${BASE_URL}/stockOut/getLocationId/${locations._id}`);
    const employee = useMemo(() => JSON.parse(localStorage.getItem('user')), []);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [print, setPrint] = useState(false); // Thêm state cho print

    const [formData, setFormData] = useState({
        products: [],
        dateOut: '',
        note: '',
        locationId:locations._id,
        status: 'Đã hoàn tất',
        employeeGive: '',
        employeeId: employee._id
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const addItem = (item) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            products: [...prevFormData.products, item]
        }));
    };
    const deleteItem = (key, index) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [key]: prevFormData[key].filter((_, i) => i !== index)
        }))

    }
    const handleProductChange = (index, productId) => {
        const updatedProducts = formData.products.map((product, i) =>
            i === index ? { ...product, productId } : product
        );
        setFormData({ ...formData, products: updatedProducts });
    };

    const handleQuantityChange = (index, quantity) => {
        const updatedProducts = formData.products.map((product, i) =>
            i === index ? { ...product, quantity } : product
        );
        setFormData({ ...formData, products: updatedProducts });
    };

    const addProducts = (e) => {
        e.preventDefault();
        addItem({ productId: '', quantity: '' });
    };
    const deleteProduct = (e, index) => {
        e.preventDefault()
        deleteItem('products', index)
    }



    const submitHandler = useCallback(async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/stockOut`, {
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
            if (response.ok) {
                handleClose()
            }


            toast.success(message);
            navigate('/warehouse');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [formData, navigate]);

    const handlePrint = () => {
        setPrint(true); // Thiết lập trạng thái in khi nhấn
        setTimeout(() => {
            window.print();
            setPrint(false); // Reset trạng thái in sau khi in
        }, 0);
    };
    return (
        <>
            <div className="border-0 py-3 px-1.5 bg-blue-500 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                <div className="flex items-start justify-between border-b border-solid border-blueGray-200 rounded-t">
                    <div className="flex gap-2 items-center">
                        <img src={CategoryIcon} className="w-4 h-4" alt="Category Icon" />
                        <h3 className="text-[14px] font-normal">Xuất sản phẩm</h3>
                    </div>
                    <button
                        className="p-2 ml-auto border-0 rounded-b-none hover:bg-red-500 hover:text-white text-black float-right text-lg leading-none font-semibold outline-none focus:outline-none"
                        onClick={handleClose}
                    >
                        <span className="mx-auto">x</span>
                    </button>
                </div>

                <div className="relative border-0 border-slate-500 flex-auto">
                    <div className="border-b-2 px-2 bg-white flex gap-3">


                        <div className="items-center cursor-pointer" onClick={submitHandler}>
                            <img src={SaveIcon} className="w-6 h-6" alt="Save Icon" />
                            <p className="text-[12px] font-normal">Lưu</p>
                        </div>

                        <div className="items-center cursor-pointer" >
                            <div className="items-center text-center text-blue-800 text-[25px] w-6 h-6" onClick={handlePrint}>
                                <BiPrinter className="mt-[0.75px]" />
                            </div>
                            <p className="text-[12px] font-normal text-center">In</p>
                        </div>



                    </div>

                </div>
                <div className="bg-white h-[600px] overflow-auto">
                    <div className="flex gap-x-2 bg-blue-500">
                        <div className="p-1  cursor-pointer text-white italic font-normal" >
                            <p>Chi tiết phiếu xuất</p>
                        </div>

                    </div>
                    <div>
                        <form action="" onSubmit={submitHandler}>
                            <div>
                                <div className="grid grid-cols-2  gap-2 mx-auto w-1/2 ">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700 w-1/4">Ngày:</label>
                                        <input
                                            type="date"
                                            name="dateOut"
                                            onChange={handleInputChange}
                                            className="mt-1 px-2 py-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700 w-1/2">Trạng thái:</label>
                                        <select
                                            name="status"
                                            className="mt-1 px-2 py-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            onChange={handleInputChange}
                                            value={formData.status}
                                        >
                                            <option value="">Chọn trạng thái</option>
                                            <option value="Đã hoàn tất">Đã hoàn tất</option>
                                            <option value="Chưa hoàn tất">Chưa hoàn tất</option>
                                        </select>
                                    </div>

                                </div>
                                <div className="flex items-center justify-center  mx-auto w-1/2 ">
                                    <label className="block text-sm font-medium text-gray-700 w-1/3">Nhân viên nhận:</label>
                                    <select
                                        name="employeeGive"
                                        className="mt-1 px-2 py-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        onChange={handleInputChange}
                                        value={formData.employeeGive}
                                    >
                                        <option value="">Chọn nhân viên nhận</option>
                                        {
                                            employees.map((item, index) => (
                                                <option key={index} value={item._id}>{item.name}</option>

                                            ))
                                        }

                                    </select>
                                </div>
                                <div className="flex items-center justify-center  mx-auto w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 w-1/6">Ghi chú:</label>
                                    <input
                                        type="text"
                                        name="note"
                                        onChange={handleInputChange}
                                        className="mt-1 px-2 py-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-start  mx-auto w-1/2 mt-5 ">
                                <p className="italic font-bold">Thông tin sản phẩm</p>

                                <div className="ml-4" >

                                <button onClick={addProducts} className="bg-[#000] rounded-full   text-white cursor-pointer">
                                <BiPlus />
                            </button>
                            </div>

                            </div>
                            <div className="mx-auto w-1/2 px-3">

                            {formData.products.map((item, index) => (
                                <div key={index} >
                                    <div className='grid grid-cols-4 gap-2 relative '>
                                        <div className='col-span-3  flex items-center justify-center'>
                                            <div className="block text-sm font-medium text-gray-700 w-1/2">Tên sản phẩm <sup className='text-red-600'>*</sup>:</div>
                                            <select
                                                value={item.productId}
                                                onChange={(e) => handleProductChange(index, e.target.value)}
                                                className='mt-1 px-2 py-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                                required
                                            >
                                                <option value="">Chọn sản phẩm</option>
                                                {
                                                
                                                locations?.products?.map(item => (
                                                    <option key={item._id} value={item.product._id}>{item.product.name}</option>
                                                ))
                                                }
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <div className="block text-sm font-medium text-gray-700 w-1/2">SL <sup className='text-red-600'>*</sup>:</div>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                className='mt-1 px-2 py-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                                min="1"
                                                required
                                            />
                                        </div>

                                    <div className="absolute -right-10 top-0" >

                                        <button onClick={e => deleteProduct(e, index)} className="bg-red-600 rounded-full text-white text-[16px] m-auto mb-[30px] cursor-pointer">
                                            <AiOutlineDelete />
                                        </button>
                                    </div>
                                    </div>
                                </div>
                            ))}
                            </div>
                           

                            
                            
                        </form>

                    </div>
                    <div className="bg-blue-500 h-5 mt-2"></div>
                    <div>
                        <Inventory stockIn={stockIns} location={locations} />

                    </div>
                    
                    {print && <PrintStockOut stockOut={stockOuts} />}
                    


                </div>
            </div>
            

            

        </>
    );
}

export default StockOut;

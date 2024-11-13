/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { authContext } from "../context/AuthContext";
import useFetchData from "../Hook/userFecthData";
import { BASE_URL } from "../../config";
import cartLogo from "../assets/images/cartLogo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormatPrice from "../utils/formatPrice";
import { toast } from "react-toastify";

const Payment = () => {
    const { user } = useContext(authContext);
    const [selectedProducts, setSelectedProducts] = useState([]);
    
    const [debounceVoucher, setDebounceVoucher] = useState('');
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const cartProducts = location.state?.cartProducts || [];

    const navigate = useNavigate();

    const [voucher, setVoucher] = useState('');
    const [discount, setDiscount] = useState(0);

    const { data: vouchers} = useFetchData(`${BASE_URL}/promotion/voucher/${debounceVoucher}`);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceVoucher(voucher.trim());
        }, 500);
        return () => clearTimeout(timeout);
    }, [voucher]);

    

    const calculateDiscountedPrice = (price, discount) => {
        return price * (1 - discount / 100);
    };
  
    const totalAmountBeforeDiscount =cartProducts.reduce((total, item) => {

        return selectedProducts.includes(item.product._id) ? total + ((Math.max(item.quantity, 0))*(calculateDiscountedPrice(item.product?.price, item.product?.discount))):total
        
    }, 0);

    const discountOfProduct = useMemo(() => {
        if (!cartProducts) return 0;
    
        return cartProducts.reduce((total, item) => {
            const price = item.product?.price || 0;
            const discount = item.product?.discount || 0;  // Discount nếu không có sẽ là 0
            return (price * discount / 100)*item.quantity; // Cộng dồn vào tổng số tiền

        }, 0);// Giá trị khởi tạo là 0
    }, [cartProducts]);

    const [voucherValid, setVoucherValid] = useState(false);
        const discountVoucher =  voucherValid ?  vouchers.sale  : 0;
        
        
        let  totalSale = 0;
        if(discountVoucher){
            totalSale = discount + discountVoucher + discountOfProduct
        }else{
            totalSale = discount + discountOfProduct;
        }
        

        const totalAmountAfterDiscount = useMemo(() => {
            const validDiscount = Math.min(discount, totalAmountBeforeDiscount);
            const voucherDiscount = voucherValid ?  vouchers.sale  : 0;
            if(voucherDiscount > 0)return totalAmountBeforeDiscount - validDiscount - voucherDiscount;
            else return totalAmountBeforeDiscount - validDiscount;
        }, [totalAmountBeforeDiscount, discount, vouchers, voucherValid]);

        const [formData, setFormData] = useState({
            products: [],
            userId: user._id,
            totalAmountAfterDiscount,
            employeeId:'',
            discount,
            totalSale,
            promotionId:vouchers?._id,
            
        });
        useEffect(() => {
            if (cartProducts) {
                setFormData(prev => ({
                    ...prev,
                    products: cartProducts.map(item => ({
                        productId: item.product._id,
                        quantity: item.quantity
                    }))
                }));
            }
        }, [cartProducts]);

        useEffect(() => {
            setFormData(prev => ({
                ...prev,
                discount,
                totalSale,
                promotionId:vouchers?._id,
                totalAmountAfterDiscount // Cập nhật tổng số tiền sau giảm giá
            }));
        }, [totalAmountAfterDiscount,discount,totalSale,vouchers]);



    

    const handleSelectProduct = (productId) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(productId)
                ? prevSelected.filter((id) => id !== productId)
                : [...prevSelected, productId]
        );
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === cartProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(cartProducts.map((item) => item.product._id));
        }
    };
    const isFormValid = useMemo(() => {
        return formData.products.length > 0 ;
    }, [formData]);

    
    
   
    const totalQuantity = cartProducts.reduce((total, item) => {
        return selectedProducts.includes(item.product._id)
            ? total + item.quantity
            : total;
    }, 0);

    const submitHandler = useCallback(async (event) => {
        event.preventDefault();
    
        // Kiểm tra tính hợp lệ của biểu mẫu
        if (!isFormValid) {
            toast.error("Vui lòng chọn sản phẩm và người dùng trước khi đặt hàng.");
            return;
        }
    
        // Xác nhận trước khi in
        const shouldPrint = window.confirm("Xác nhận thanh toán?");
        if (shouldPrint) {
            setLoading(true);
    
            try {
                const response = await fetch(`${BASE_URL}/order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...formData,
                        createdAt: new Date().toISOString()
                    })
                });
    
                const { message } = await response.json();
    
                // Kiểm tra xem phản hồi có ok không
                if (!response.ok) {
                    let errorMessage = message || "Có lỗi xảy ra.";
                    throw new Error(errorMessage);
                }
    
                // In hóa đơn khi yêu cầu thành công
                window.print();
                toast.success(message);
                navigate('/users/profile/me');
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        } else {
            toast.info("Đơn hàng sẽ không được tạo.");
        }
    }, [formData, isFormValid, navigate]);

    const handleDiscountChange = (e) => {
        const inputValue = Number(e.target.value);

        // Giới hạn giảm giá
        if (inputValue < 0 || inputValue > totalAmountBeforeDiscount || (user?.point - inputValue) < 0) {
            toast.error("Giảm giá không hợp lệ.");
            setDiscount(0);
        } else {
            setDiscount(inputValue);
        }
    };
    const handleVoucherChange = async (e) => {
        const inputValue = e.target.value;
        setVoucher(inputValue);

        if (inputValue) {
                setVoucherValid(true);
        } else {
            setVoucherValid(false);

        }
    };
    


    return (
        <form onSubmit={submitHandler} className="container mx-auto pt-8">
            {cartProducts.length > 0 ? (
                <div className="flex flex-col">
                    <div className="overflow-x-auto">
                        <div className="flex justify-center items-center">
                            <h2>Điểm tiêu dùng:</h2>
                            <p>{user.point}</p>
                        </div>
                        <table className="w-3/4 mx-auto text-sm mt-5 text-center border-2 border-slate-300">
                            <thead className="text-[16px] border-b-2 border-b-slate-300">
                                <tr>
                                    <th className="p-4">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectedProducts.length === cartProducts.length}
                                        />
                                    </th>
                                    <th className="px-3 py-3">Sản Phẩm</th>
                                    <th className="px-3 py-3">Đơn Giá</th>
                                    <th className="px-3 py-3">Số Lượng</th>
                                    <th className="px-3 py-3">Số Tiền</th>
                                    {/* <th className="px-3 py-3">Thao Tác</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {cartProducts.map((item) => (
                                    <tr key={item.product._id} className="border-t">
                                        <td className="p-4 ">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleSelectProduct(item.product._id)}
                                                checked={selectedProducts.includes(item.product._id)}
                                            />
                                        </td>
                                        <td className="p-4 flex items-center gap-4">
                                            <img src={item.product.photo} alt={item.product.name} className="w-[50px] h-[50px] object-cover rounded" />
                                            <span className="truncate w-[200px]">{item.product.name}</span>
                                        </td>
                                        <td className="p-4 text-center">{FormatPrice(item.product.price)}</td>
                                        <td className="p-4 flex items-center justify-center">
                                            
                                            <span className="mx-2">{item.quantity}</span>
                                            
                                        </td>
                                        <td className="p-4 text-center">
                                            {FormatPrice(item.quantity * item.product.price)}
                                        </td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-2">
                        <div className="grid grid-cols-2 mb-2">
                            <p className="text-end font-semibold">Tổng:</p>
                            <p className="text-center">{FormatPrice(totalAmountBeforeDiscount)}</p>
                        </div>
                        <div className="grid grid-cols-2 mb-2">
                            <p className="text-end">Điểm:</p>
                            <input
                                type="number"
                                id="discount"
                                value={discount}
                                onChange={handleDiscountChange}
                                className="border-0 border-gray-300 rounded ml-2 text-center focus:outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 mb-2">
                            <p className="text-end">Voucher:</p>
                            <input
                            type="text"
                            value={voucher}
                            onChange={handleVoucherChange}
                            className="border-0 border-gray-300 text-center rounded ml-2 focus:outline-none"
                        />
                       
                        </div>
                        <div className="grid grid-cols-2 mb-2">
                            <p className="text-end">Tổng Giảm:</p>
                            <p className="text-center">{FormatPrice(totalSale)}</p>
                        </div>
                        <hr className="" />

                        <div className="grid grid-cols-2 mt-2 mb-2">
                            <p className="text-end font-semibold">Thanh toán:</p>
                            <p className="text-center">{FormatPrice(totalAmountAfterDiscount)}</p>
                        </div>
                        

                    </div>
                    </div>


                    <div className="w-full bg-sky-400">
                        <div className="mt-4 flex justify-between mx-auto w-3/4">
                            <div className="px-3 flex gap-2 items-center justify-center" >
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedProducts.length === cartProducts.length}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                <p>Chọn tất cả ({cartProducts.length})</p>

                            </div>
                            <div>

                                <span className="text-lg font-semibold ">Tổng Tiền ({totalQuantity} sản phẩm):</span>
                                <span className="text-lg font-semibold mx-2 text-red-500"><sup>đ</sup>{FormatPrice(totalAmountBeforeDiscount)}</span>
                               
                                    <button
                                       
                                        className="bg-orange-500 text-white py-3 px-10 rounded-lg text-lg font-semibold "
                                        type="submit"
                                            
                                    >
                                        Thanh toán
                                    </button>
                                
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <div className="w-[150px] mx-auto pt-16">
                        <img src={cartLogo} alt="Giỏ hàng trống" />
                    </div>
                    <h2 className="text-[18px] text-center font-extrabold italic">Giỏ hàng trống</h2>
                    <p className="text-center text-slate-400">Không có sản phẩm nào trong giỏ hàng</p>
                    <Link to="/home" className="mx-auto items-center flex justify-center">
                        <button className="border bg-primaryColor py-2 px-32 my-5 rounded-md text-white">
                            Về trang chủ
                        </button>
                    </Link>
                </div>
            )}
        </form>
    );
};

export default Payment;

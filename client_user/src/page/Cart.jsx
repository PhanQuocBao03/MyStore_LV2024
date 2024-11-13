/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useContext, useState, useEffect } from "react";
import { authContext } from "../context/AuthContext";
import useFetchData from "../Hook/userFecthData";
import { BASE_URL } from "../../config";
import cartLogo from "../assets/images/cartLogo.png";
import { Link, useNavigate } from "react-router-dom";
import FormatPrice from "../utils/formatPrice";
import { toast } from "react-toastify";

const Cart = () => {
    const { user } = useContext(authContext); // Lấy user từ context
    
    // Chỉ gọi API khi user đã có _id
    const { data: carts } = user && user._id 
    ? useFetchData(`${BASE_URL}/cart/${user._id}`) 
    : { data: [] };

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [cartProducts, setCartProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (carts?.products) {
            setCartProducts(carts.products);
        }
    }, [carts]);

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

    const handleQuantityChange = async (index, change) => {
        const updatedProducts = [...cartProducts];
        const productId = updatedProducts[index].product._id;
        const newQuantity = updatedProducts[index].quantity + change;

        if (newQuantity > 0) {
            updatedProducts[index].quantity = newQuantity;
            setCartProducts(updatedProducts);

            try {
                const res = await fetch(`${BASE_URL}/cart/${user._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        quantity: newQuantity,
                        productId: productId,
                    }),
                });

                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.message);
                }
                toast.success(result.message);
            } catch (error) {
                toast.error(error.message);
                console.error("Lỗi khi cập nhật số lượng trong CSDL:", error);
            }
        }
    };

    const handleRemoveProduct = async (productId) => {
        setCartProducts(cartProducts.filter((item) => item.product._id !== productId));
        setSelectedProducts(selectedProducts.filter((id) => id !== productId));

        try {
            const res = await fetch(`${BASE_URL}/cart/${user._id}/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }
            toast.success(result.message);
        } catch (error) {
            toast.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng.");
        }
    };

    const getTotalAmount = () => {
        return cartProducts.reduce((total, item) => {
            return selectedProducts.includes(item.product._id)
                ? total + item.product.price * item.quantity
                : total;
        }, 0);
    };

    const getTotalQuantity = () => {
        return cartProducts.reduce((total, item) => {
            return selectedProducts.includes(item.product._id) ? total + item.quantity : total;
        }, 0);
    };

    const handleProceedToCheckout = () => {
        if (selectedProducts.length === 0) {
            toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
            return;
        }

        if (cartProducts.length === 0) {
            toast.error("Giỏ hàng của bạn trống, vui lòng thêm sản phẩm vào giỏ hàng!");
            return;
        }

        navigate("/checkout", {
            state: { 
                cartProducts, // Dữ liệu giỏ hàng
                selectedProducts // Các sản phẩm đã chọn
            },
        });
    };

    return (
        <div className="container mx-auto pt-8">
            {cartProducts.length > 0 ? (
                <div className="flex flex-col">
                    <div className="overflow-x-auto">
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
                                    <th className="px-3 py-3">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartProducts.map((item, index) => (
                                    <tr key={item.product._id} className="border-t">
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleSelectProduct(item.product._id)}
                                                checked={selectedProducts.includes(item.product._id)}
                                            />
                                        </td>
                                        <td className="p-4 flex items-center gap-4">
                                            <img
                                                src={item.product.photo}
                                                alt={item.product.name}
                                                className="w-[50px] h-[50px] object-cover rounded"
                                            />
                                            <span className="truncate w-[200px]">{item.product.name}</span>
                                        </td>
                                        <td className="p-4 text-center">{FormatPrice(item.product.price)}</td>
                                        <td className="p-4 flex items-center justify-center">
                                            <button
                                                className="px-2 py-1 border border-gray-300 rounded-md"
                                                onClick={() => handleQuantityChange(index, -1)}
                                            >
                                                -
                                            </button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <button
                                                className="px-2 py-1 border border-gray-300 rounded-md"
                                                onClick={() => handleQuantityChange(index, 1)}
                                            >
                                                +
                                            </button>
                                        </td>
                                        <td className="p-4 text-center">
                                            {FormatPrice(item.quantity * item.product.price)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleRemoveProduct(item.product._id)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="w-full bg-sky-400">
                        <div className="mt-4 flex justify-between mx-auto w-3/4">
                            <div className="px-3 flex gap-2 items-center justify-center">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedProducts.length === cartProducts.length}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                <p>Chọn tất cả ({cartProducts.length})</p>
                            </div>
                            <div className="flex items-center justify-center">

                                <div>
                                <span className="text-lg font-semibold">Tổng Tiền ({getTotalQuantity()} sản phẩm):</span>
                                <span className="text-lg font-semibold mx-2 text-red-500">
                                    <sup>đ</sup>{FormatPrice(getTotalAmount())}
                                </span>
                                </div>
                                
                                <button onClick={handleProceedToCheckout} className={`bg-orange-500 text-white py-3 px-10 mb-2 rounded-lg text-lg font-semibold ${selectedProducts.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                                            }`}>Thanh toán</button>
                                
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
        </div>
    );
};

export default Cart;

import { useContext } from "react";
import { authContext } from "../../context/AuthContext";
import useFetchData from "../../Hook/userFecthData";
import { BASE_URL } from "../../../config";
import { FaCartPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import FormatPrice from "../../utils/formatPrice";


const Cart = () => {
    const {user} = useContext(authContext);
    const {data:carts}=useFetchData(`${BASE_URL}/cart/${user._id}`);
    
    return (
        <div>
        {carts?.products?.length > 0 ? (
           <div>
            <h2 className="text-slate-300 font-semibold px-5 leading-5 pt-5">Sản phẩm mới thêm</h2>
            {
                carts?.products?.slice(0, 5).map((pro)=>(
                    <div key={pro._id} className="px-5 leading-[62px] hover:bg-gray-100 flex items-center justify-center gap-3">
                        <div className="w-[70px] border border-slate-200 ">

                        <img src={pro.product.photo} alt="" />
                        </div>
                        <p className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{pro.product.name}</p>

                        <div className="flex text-red-500 items-center justify-center">
                            <sup>đ</sup>
                            <p>{FormatPrice (pro.product.price)}</p>

                        </div>

                    </div>
                ))
            }
            <div className="flex justify-between mx-5 items-center">
                <p>{carts.products.length} sản phẩm trong giỏ hàng</p>
                <Link to='/cart'>
                <div  className="border rounded-lg px-3  bg-sky-500 text-white">

                    <p className="leading-9">Xem giỏ hàng</p>
                </div>
                
                </Link>

            </div>
           </div>
        ) : (
            <div>
                <div className="flex-col">
                    <div className="text-[80px] mx-auto mt-8 border rounded-full w-[150px] h-[150px] p-7 bg-white text-center items-center">

                        <FaCartPlus />
                    </div>


                <p className="text-center leading-7 font-extrabold mb-8">Không có sản phẩm nào trong giỏ hàng!</p>
                </div>
            </div>
        )}
    </div>
    );
}

export default Cart;

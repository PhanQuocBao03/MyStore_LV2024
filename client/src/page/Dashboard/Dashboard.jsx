import { FaBook, FaMoneyBill, FaRegEye, FaShoppingCart } from "react-icons/fa";
import Header from "../../components/Header/Header";
import useFetchData from "../../Hook/userFecthData";
import { BASE_URL } from "../../../config";
import OrderTable from "../../components/Dasboard/order/orderTable";
import UserTable from "../../components/Dasboard/users/userTable";
import Revenue from "../../components/Chart/revenue";
import FormatPrice from "../../utils/formatPrice";

const Dashboard = () => {
    const { data: orders } = useFetchData(`${BASE_URL}/order`);
    const { data: users } = useFetchData(`${BASE_URL}/user`);
    const { data: retails } = useFetchData(`${BASE_URL}/retail`);
    const { data: products } = useFetchData(`${BASE_URL}/product`);

    const totalOrder = orders.reduce((acc,currentValue)=>{
        return acc + currentValue.totalAmount
    },0)
    const totalRetail = retails.reduce((acc,currentValue)=>{
        return acc + currentValue.totalAmount
    },0)
    const total = totalOrder + totalRetail;

    return (
        <div>
            <Header />
            <div className="grid lg:grid-cols-4 gap-5 sm:grid-cols-2 mx-5 mt-5">
                <div className="h-[120px] bg-green-800 flex items-center justify-center gap-5">
                    <div>
                        <p className=" text-xl font-semibold text-white">{orders.length}</p>
                        <h1 className=" text-lg text-white">Người dùng</h1>
                        <p className="text-[12px] italic">(Tổng số người dùng)</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white text-green-800 text-center items-center flex justify-center text-[29px]">
                        <FaBook />
                    </div>
                </div>
                <div className="h-[120px] bg-yellow-800 flex items-center justify-center gap-5">
                    <div>
                        <p className="text-xl font-semibold text-white">
                            {products.length}
                        </p>

                        <h1 className=" text-lg text-white">Sản phẩm</h1>
                        <p className="text-[12px] italic">(Tổng số sản phẩm)</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white text-yellow-800 text-center items-center flex justify-center text-[29px]">
                        <FaRegEye />
                    </div>

                </div>
                <div className="h-[120px] bg-blue-800 flex items-center justify-center gap-5">
                    <div>
                        <p className=" text-xl font-semibold text-white">{orders.length}</p>
                        <h1 className=" text-lg text-white">Đơn hàng</h1>
                        <p className="text-[12px] italic">(Tổng số đơn hàng)</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white text-blue-800 text-center items-center flex justify-center text-[29px]">
                        <FaShoppingCart />
                    </div>

                </div>
                <div className="h-[120px] bg-red-800 flex items-center justify-center gap-5">
                    <div>
                        <p className=" text-xl font-semibold text-white">{FormatPrice(total)} VND</p>
                        <h1 className=" text-lg text-white">Doanh thu</h1>
                        <p className="text-[12px] italic">(Tổng doanh thu)</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white text-red-800 text-center items-center flex justify-center text-[29px]">
                        <FaMoneyBill />
                    </div>

                </div>

            </div>
            <div className="grid grid-cols-3 mx-5">
                <div className="col-span-2">
                    <div className="mt-5">
                        <Revenue retails={retails} orders={orders} />
                    </div>
                    <div className="w-2/3 mb-5">

                        <OrderTable orders={orders} />
                    </div>

                </div>
                <div className="col-span-1 mt-5">
                    <UserTable users={users} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

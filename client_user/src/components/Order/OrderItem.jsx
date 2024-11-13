/* eslint-disable react/prop-types */
import FormatPrice from "../../utils/formatPrice";
import { FormatDay } from "../../utils/formatDay";



const OrderItem = ({ handleOpenDetail, checkedOrders, currentItems, handleSelectChange }) => {
    return (
        <div>
            <div className="w-full text-sm text-center ">
                <div>
                    {currentItems.map((item) => (
                        <div key={item._id} className="text-[16px] text-center px-10 flex border-2 border-slate-300 my-5 bg-white">
                            {
                                item.products.map(pro => (
                                    <div key={pro._id} className="text-[16px] text-center px-10 flex items-center justify-center">
                                        <div className=" w-[82px]  "><img src={pro.product.photo} alt="" /></div>
                                        <div className="">
                                            <div>

                                            {pro.product.name}
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <h3 className="text-[12px]">Phân loại hàng hóa:</h3>
                                                <p>{pro.product.type?.size}</p>
                                            </div>
                                            <p>X{pro.quantity}</p>
                                        </div>
                                        <div className="">{item.user ? item.user.address : item.address}</div>
                                        <div className="">{item.user ? item.user.phone : item.phone}</div>
                                    </div>
                                ))
                            }

                            <div className="pr-3 py-4">{FormatDay(item.createdAt)}</div>
                            <div className={`pr-3 py-4 ${item.status === 'Đang xử lý' ? 'text-green-500' :
                                    item.status === 'Chờ vận chuyển' ? 'text-yellow-500' :
                                        item.status === 'Chờ thanh toán' ? 'text-orange-500' :
                                            item.status === 'Đơn hủy' ? 'text-red-500' : ''
                                }`}>
                                {item.status}
                            </div>
                            <div className="pr-3 py-4">{FormatPrice(item.totalAmount)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default OrderItem;

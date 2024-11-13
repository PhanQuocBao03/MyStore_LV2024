/* eslint-disable react/prop-types */

import { FormatDay } from "../../../utils/formatDay";
import FormatPrice from "../../../utils/formatPrice";
import logo from "../../../assets/images/logo.png";


const PrintStockOut = ({stockOut}) => {
    let totalQuantity = 0;
    let totalPrice = 0; // Thêm biến để tính tổng giá trị
    console.log("stockOut",stockOut)

    const latestStockIn = stockOut
            .sort((a, b) => new Date(b.dateOut) - new Date(a.dateOut))[0];
    return (
        <div className="print-stockIn w-10/12 ml-10">
            <div className="grid grid-cols-2">
                <div className="relative">
                    <img className="w-[216px]" src={logo} alt="" />
                    <div className="absolute top-8 left-7 mt-2 text-center w-[216px]">
                        <p className='text-[13px]'>Chất lượng thật - Giá trị thật</p>
                    </div>
                    <h2 className="font-semibold text-[13px] mt-1">Cửa hàng thiết bị điện tử 2002Store</h2>
                    <p className="font-normal text-[13px]">
                        <span className="font-semibold text-[13px]">Địa chỉ:</span> 141/5c 30 tháng 4, Phường Hưng lợi, Quận Ninh Kiều, Cần Thơ
                    </p>
                </div>
                <div className="item-end justify-end flex">
                    <div className="border border-slate-700 py-5 px-1 w-1/3 h-2/3">
                        <div className="flex gap-2 items-left italic justify-center">
                            <p>Khu vực:</p>
                            <p>{latestStockIn.location.zone.symbol}</p>
                        </div>
                        <div className="flex gap-2 items-left italic justify-center">
                            <p>Vị trí</p>
                            <p>{latestStockIn.location.rack ? latestStockIn.location.rack : latestStockIn.location.pallet}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="m-5">
                <h1 className="font-extrabold text-[22px] text-center leading-3">PHIẾU XUẤT</h1>
                <p className="text-center text-[13px] italic font-normal py-1">số phiếu: {latestStockIn._id} - Ngày xuất: {FormatDay(latestStockIn.dateOut)}</p>
            </div>
            <div className="mb-5">
               
                    <div  className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-[14px]">NV nhận:</p>
                            <p>{latestStockIn.employeeGive.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-[14px]">Số điện thoại:</p>
                            <p>{latestStockIn.employeeGive.phone}</p>
                        </div>
                    </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-[14px]">Thủ kho:</p>
                        <p>{latestStockIn.employee.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-[14px]">Số điện thoại:</p>
                        <p>{latestStockIn.employee.phone}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-[14px]">Địa chỉ:</p>
                    <p>141/5c 30 tháng 4, Phường Hưng lợi, Quận Ninh Kiều, Cần Thơ</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-[14px]">Ghi chú:</p>
                    <p>{latestStockIn?.note}</p>
                </div>
            </div>

            <table className="border-slate-400 border-t-2">
                <thead className="bg-blue-100">
                    <tr>
                        <th className="border-0 border-x-2 border-solid border-slate-400 p-1">STT</th>
                        <th className="border-0 border-r-2 border-solid border-slate-400 p-1">SỐ PHIẾU</th>
                        <th className="border-0 border-r-2 border-solid border-slate-400 p-1">TÊN HÀNG HÓA</th>
                        <th className="border-0 border-r-2 border-solid border-slate-400 p-1">ĐVT</th>
                        <th className="border-0 border-r-2 border-solid border-slate-400 p-1">SỐ LƯỢNG</th>
                        <th className="border-0 border-r-2 border-solid border-slate-400 p-1">GIÁ NHẬP</th>
                        <th className="border-0 border-r-2 border-solid border-slate-400 p-1">THÀNH TIỀN</th>
                    </tr>
                </thead>
                <tbody>
                    {latestStockIn.products.map((item, index) => {
                        totalQuantity += item.quantity;
                        const itemTotalPrice = item.product.price * item.quantity; // Tính tổng giá trị cho mỗi sản phẩm
                        totalPrice += itemTotalPrice; // Cộng dồn vào tổng giá trị
                        return (
                            <tr key={index}>
                                <td className="w-4 bg-white hover:bg-blue-500 text-center items-center border-2 border-l-2 border-solid border-slate-400 p-1">{index + 1}</td>
                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 uppercase p-1">{latestStockIn._id}</td>
                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">{item?.product?.name}</td>
                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">Cái</td>
                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">{item?.quantity}</td>
                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1"></td>
                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">{FormatPrice(itemTotalPrice)}</td>
                            </tr>
                        );
                    })}

                    <tr className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">
                        <td></td>
                        <td></td>
                        <td className="text-center font-semibold">TỔNG CỘNG</td>
                        <td></td>
                        <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">{totalQuantity}</td>
                        <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1"></td>
                        <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">{FormatPrice(totalPrice)}</td>
                    </tr>

                </tbody>
            </table>

            <div className="grid grid-cols-2 mt-5 ">
                <div className="text-center">
                    <p className="font-semibold">THỦ KHO</p>
                </div>
                <div className="items-center text-center">
                    <p>Ngày...tháng...năm...</p>
                    <p className="font-semibold">Người lập</p>
                    <p className="font-bold mt-10">{latestStockIn.employee.name}</p>
                </div>
            </div>
        </div>
    );
}

export default PrintStockOut;

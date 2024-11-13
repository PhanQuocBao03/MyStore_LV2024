/* eslint-disable react/prop-types */

import { Dialog, DialogBody, DialogHeader, DialogFooter } from '@material-tailwind/react';
import useFetchData from '../../Hook/userFecthData';
import { BASE_URL, token } from '../../../config';
import { useEffect, useState } from 'react';
import closeIcon from '../../assets/images/close.png';
import logo from "../../assets/images/logo.png";
import {FormatDay} from '../../utils/formatDay';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Barcode from 'react-barcode';
import nowfree from '../../assets/images/delivery-120-minutes.png';
import FormatPrice from '../../utils/formatPrice';
const OrderDetailDialog = ({ open, handleClose, orderId }) => {
    const { data: order } = useFetchData(orderId ? `${BASE_URL}/order/${orderId}` : null);
    const [formData, setFormData] = useState({
        user: {},
        products: [],
        name: '',
        address: '',
        phone: '',
        payment: '',
        orderID: '',
        createdAt: '',
        note: '',
        status: '',
        totalAmount: 0
    });

    useEffect(() => {
        if (order && Object.keys(order).length > 0) {
            setFormData({
                user: order.user || {},
                products: order.products || [],
                orderID: order.orderID || '',
                createdAt: order.createdAt,
                name: order.name || '',
                address: order.address || '',
                phone: order.phone || '',
                payment: order.payment || '',
                note: order.note || '',
                status: order.status || '',
                totalAmount: calculateTotalAmount(order.products || []) // Tính tổng lúc khởi tạo
            });
        }
    }, [order]);

    const calculateTotalAmount = (products) => {
        return products.reduce((total, item) => {
            const itemTotal = (item.product?.price * item.quantity) - ((item.product?.price * item.quantity) * (item.product?.discount / 100));
            return total + itemTotal;
        }, 0);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const navigate = useNavigate();
    const handleComfirm = async (event) => {
        event.preventDefault();
    
        // Kiểm tra trạng thái hiện tại và xác định trạng thái mới
        let newStatus;
        if (formData.status === 'Đang xử lý') {
            newStatus = 'Chờ vận chuyển';
        }  else if (formData.status === 'Chờ vận chuyển') {
            newStatus = 'Chờ thanh toán';
        }
        else if (formData.status === 'Chờ thanh toán') {
            newStatus = 'Chờ thanh toán';
        } else {
            toast.error('Trạng thái đơn hàng không thể cập nhật.');
            return; // Ngừng thực hiện nếu trạng thái không hợp lệ
        }
        
    
        const orderUpdate = {
            ...formData,
            status: newStatus, // Cập nhật trạng thái đơn hàng mới
            user: formData.user ? formData.user._id : null 
        };
    
        try {
            const res = await fetch(`${BASE_URL}/order/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderUpdate)
            });
    
            const { message } = await res.json();
    
            if (!res.ok) {
                throw new Error(message);
            }
    
            navigate('/order');
            handleClose();
            toast.success(message);
        } catch (error) {
            toast.error(error.message);
        }
    };
    
    const handlePrint = () => {
        window.print();
    };
    const handleCancel = async (event) => {
        event.preventDefault();
        if (formData.status !== 'Đang xử lý') {
            handleClose();
            toast.error('Trạng thái đơn hàng không thể hủy.');
            return;
        }
    
        const orderUpdate = {
            ...formData,
            status: 'Đơn hủy' ,
            user: formData.user ? formData.user._id : null 
        };
    
        try {
            const res = await fetch(`${BASE_URL}/order/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderUpdate)
            });
    
            const { message } = await res.json();
    
            if (!res.ok) {
                throw new Error(message);
            }
    
            navigate('/order');
            handleClose();
            toast.success('Đơn hàng đã bị hủy');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const totalQuantity = formData.products.reduce((sum, item) => sum + (item.quantity || 0), 0);

    return (
        <Dialog
            open={open}
            handler={handleClose}
            size='lg'
            animate={{
                mount: { x: 1, y: 0 },
                unmount: { x: 0.9, y: -100 }
            }}
            
            className='fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50'
        >
            <div className="relative w-full max-w-4xl bg-white border border-gray-300 shadow-2xl rounded-lg">
            <form onSubmit={handleComfirm}>
                <DialogHeader className="no-print text-white justify-center heading rounded-t-lg bg-blue-400 gap-3">
                    Chi tiết <span className='text-primaryColor'>Đơn hàng</span>
                    <div className="absolute top-2 right-2">
                        <img src={closeIcon} onClick={handleClose} className='w-5 h-5' alt="" />
                    </div>
                </DialogHeader>
                <DialogBody>
                    <div>
                        <div className="grid grid-cols-2 border-0 border-b-2 pb-2 m-0 border-dashed border-slate-950">
                            <div className="relative">
                                <img className="w-[216px]" src={logo} alt="" />
                                <div className="absolute top-8 left-7 mt-2 text-center w-[216px]">
                                    <p className='text-[13px]'>Chất lượng thật - Giá trị thật</p>
                                </div>
                                <h2 className="font-semibold text-[13px] mt-1">Cửa hàng thiết bị điện tử 2002Store</h2>
                                <p className="font-normal text-[13px]">
                                    <span className="font-semibold text-[13px]">Địa chỉ:</span> 141/5c 30 tháng 4, Phường Hưng lợi, Quận Ninh Kiều, Cần Thơ
                                </p>
                                <p className="font-normal text-[13px]">
                                    Xem hệ thống cửa hàng 2002Store tại <span className="font-semibold">LINK</span>
                                </p>
                            </div>
                            <div className='mx-auto w-full grid grid-cols-4'>
                                <div className='col-span-1 m-auto'>
                                    <div>
                                        <img src={nowfree} alt="" />
                                    </div>
                                </div>
                                <div className='flex flex-col col-span-3'>
                                    <div className='mb-1'>
                                        <p className='heading'>[{formData.payment.toUpperCase()}]</p>
                                    </div>
                                    <div className='flex gap-2'>
                                        {formData.orderID ? (
                                            <Barcode value={formData.orderID} width={2} height={50} displayValue={false} />
                                        ) : (
                                            <p className="text-red-500">Mã đơn hàng không có sẵn</p>
                                        )}
                                    </div>
                                    <div className='flex gap-2'>
                                        <p className='text-[13px] font-normal'>Mã đơn hàng:</p>
                                        <p className='font-semibold text-[13px]'>{formData.orderID}</p>
                                    </div>
                                    <div className='flex gap-2'>
                                        <p className='text-[13px] font-normal'>Ngày chứng từ:</p>
                                        <p className='font-semibold text-[13px]'>{FormatDay(formData.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mb-3 grid grid-cols-2'>
                            <div>
                            <div className='flex gap-2 mt-2'>
                                <p className='font-normal'>Người nhận: </p>
                                <input type="text"
                                    name='name'
                                    className='font-semibold border-0 focus:outline-none'
                                    onChange={handleInputChange}
                                    value={formData.user.name || formData.name}
                                />
                            </div>
                            <div className='flex gap-2 mt-2'>
                                <p className='font-normal'>Số điện thoại: </p>
                                <input type="text"
                                    name='phone'
                                    className='font-semibold border-0 focus:outline-none'
                                    onChange={handleInputChange}
                                    value={formData.user.phone || formData.phone}
                                />
                            </div>
                            <div className='flex gap-2 mt-2'>
                                <p className='font-normal'>Địa chỉ: </p>
                                <input type="text"
                                    name='address'
                                    className='font-semibold border-0 focus:outline-none'
                                    onChange={handleInputChange}
                                    value={formData.user.address || formData.address}
                                />
                            </div>
                            <div className='flex gap-2 mt-2'>
                                <p className='font-normal'>Ghi chú: </p>
                                <p className='italic'>{formData.note}</p>
                            </div>
                        </div>
                        <div className='m-auto no-print'>
                            <h2 className='heading'>[{formData.status}]</h2>
                        </div>
                        </div>
                        <div>
                            <table className="w-full text-sm text-center">
                                <thead className="text-sm border-2 border-slate-300">
                                    <tr>
                                        <th scope="col" className='border-2 border-slate-300 text-center font-extrabold'>STT</th>
                                        <th scope="col" className='border-2 border-slate-300 text-center font-extrabold'>Tên sản phẩm</th>
                                        <th scope="col" className='border-2 border-slate-300 text-center font-extrabold'>SL</th>
                                        <th scope="col" className='border-2 border-slate-300 text-center font-extrabold'>Giảm</th>
                                        <th scope="col" className='border-2 border-slate-300 text-center font-extrabold'>Đơn giá</th>
                                        <th scope="col" className='border-2 border-slate-300 text-center font-extrabold'>Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.products.map((item, index) => (
                                        <tr key={index}>
                                            <td className='border-2 border-slate-300'>{index + 1}</td>
                                            <td className='border-2 border-slate-300'>{item.product?.name}</td>
                                            <td className='border-2 border-slate-300'>{item.quantity}</td>
                                            <td className='border-2 border-slate-300'>{item.product?.discount}%</td>
                                            <td className='border-2 border-slate-300'>{FormatPrice(item.product?.price)}</td>
                                            <td className='border-2 border-slate-300'>
                                                {FormatPrice((item.product?.price * item.quantity) - ((item.product?.price * item.quantity) * (item.product?.discount / 100)))}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td className='border-2 border-slate-300 font-extrabold text-lg'>[{totalQuantity}]</td>
                                        <td className='border-2 border-r-0 border-slate-300'></td>
                                        <td className='border-2 border-l-0 border-slate-300 text-end'>Tạm tính:</td>
                                        <td className='border-2 border-slate-300'>{FormatPrice(formData.totalAmount)}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className='border-2 border-r-0 border-slate-300 text-end'></td>
                                        <td className='border-2 border-l-0 border-slate-300 text-end'>Voucher:</td>
                                        <td className='border-2 border-l-0 border-slate-300 text-end italic'>Thiếu hiển thị</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className='border-2 border-r-0 border-slate-300 text-end'></td>
                                        <td className='border-2 border-l-0 border-slate-300 text-end'>Phí vận chuyển:</td>
                                        <td className='border-2 border-l-0 border-slate-300 text-end'></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className='border-2 border-r-0 border-slate-300 text-end'></td>
                                        <td className='border-2 border-l-0 border-slate-300 text-end font-semibold'>Tổng tiền:</td>
                                        <td className='border-2 border-l-0 border-slate-300 text-end font-semibold'>
                                            {formData.payment === 'Đã thanh toán' ? '0' : FormatPrice(formData.totalAmount)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <div className="m-0 grid grid-cols-3 gap-5 no-print">
                        <button
                            type="button"
                            className="w-full bg-primaryColor text-white text-[18px] rounded-lg px-2 py-1"
                            onClick={handlePrint}
                        >
                            IN
                        </button>
                        <button
                            type="button"
                            className="w-full bg-red-700 text-white text-[18px] rounded-lg px-2 py-1"
                            onClick={handleCancel}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className={`${formData.status == 'Đang xử lý'
                                            ? 'w-full bg-green-700 text-white text-[18px] rounded-lg px-2 py-1'
                                            :'w-full bg-orange-500 text-white text-[18px] rounded-lg px-2 py-1'
                                        }`}
                            onClick={handleComfirm}
                        >
                            {
                            formData.status == 'Đang xử lý'?
                                   ' Xác nhận':'Giao hàng'
                            }
                        </button>
                        
                    </div>
                </DialogFooter>
            </form>
            </div>
        </Dialog>
    );
}

export default OrderDetailDialog;

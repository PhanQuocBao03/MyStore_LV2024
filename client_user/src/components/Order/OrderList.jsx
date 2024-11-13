/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import OrderItem from "./OrderItem";


const OrderList = ({orders}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [tab, setTab] = useState('all');
    const [checkedOrders, setCheckedOrders] = useState({});

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredOrders = () => {
        switch (tab) {
            case 'pending':
                return orders.filter(order => order.status === 'Đang xử lý');
            case 'wfpayment':
                return orders.filter(order => order.status === 'Chờ thanh toán');
            case 'transport':
                return orders.filter(order => order.status === 'Chờ vận chuyển');
            case 'complete':
                return orders.filter(order => order.status === 'Đã hoàn tất');
            case 'canceled':
                return orders.filter(order => order.status === 'Đơn hủy');
            default:
                return orders;
        }
    };
    const currentItems = filteredOrders()?.slice(indexOfFirstItem, indexOfLastItem);
    // const totalPages = Math.ceil(filteredOrders().length / itemsPerPage);

    const orderCounts = {
        all: orders?.length,
        pending: orders?.filter(order => order.status === 'Đang xử lý').length,
        transport: orders?.filter(order => order.status === 'Chờ vận chuyển').length,
        wfpayment: orders?.filter(order => order.status === 'Chờ thanh toán').length,
        complete: orders?.filter(order => order.status === 'Đã hoàn tất').length,
        canceled: orders?.filter(order => order.status === 'Đơn hủy').length,
    };
    const tabs = [
        { key: 'all', label: 'Tất cả' },
        { key: 'pending', label: 'Chờ xử lý' },
        { key: 'transport', label: 'Chờ giao' },
        { key: 'wfpayment', label: 'Đang giao' },
        { key: 'complete', label: 'Đã hoàn tất' },
        { key: 'canceled', label: 'Đơn hủy' },
    ];
    const handleSelectChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'allSelect') {
            const updatedCheckedOrders = {};
            currentItems.forEach(item => {
                updatedCheckedOrders[item._id] = checked;
            });
            setCheckedOrders(updatedCheckedOrders);
        } else {
            setCheckedOrders(prev => ({
                ...prev,
                [name]: checked
            }));
        }
    };

    const selectedOrderIds = Object.keys(checkedOrders).filter(id => checkedOrders[id]);

    const handleOpenDelete = () => {
        if (selectedOrderIds.length > 0) {
            setSelectedIds(selectedOrderIds);
            setOpenDialog(true);
        } else {
            toast.warn("Hãy chọn đơn hàng bạn muốn xóa!");
        }
    };

    const handleCloseDelete = () => {
        setOpenDialog(false);
        setSelectedIds([]);
    };
    const handleOpenDetail =(id)=>{
        setSelectedIds(id);
        // setOpenDetailDialog(true);
    }

    return (
        <>
        <div className="flex m-5 justify-between">
            <div className="flex">
                {tabs.map(({ key, label }) => (
                    <button
                        key={key}
                        className={`py-2 px-2 text-[16px] leading-7 font-semibold ${
                            tab === key ? 'border-b border-solid border-primaryColor text-primaryColor' : 'text-headingColor'
                        }`}
                        onClick={() => { setTab(key); setCurrentPage(1); setCheckedOrders({}); }}
                    >
                        {label} <sup>({orderCounts[key]})</sup>
                    </button>
                ))}
            </div>
            <div className="flex justify-end">
                <button
                    className={`${selectedOrderIds.length > 0 
                        ? 'border rounded-xl mr-5 flex gap-2 text-center border-solid p-2 bg-red-500 text-white '
                        : 'hidden'}`}
                    onClick={handleOpenDelete}
                >
                    <FaTrash className="mt-1" />
                    <span>Xóa</span>
                </button>
            </div>
        </div>
            <OrderItem handleOpenDetail={handleOpenDetail}checkedOrders={checkedOrders}currentItems={currentItems}handleSelectChange={handleSelectChange} />

        
        {/* <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`mx-1 px-3 py-1 rounded-lg ${
                        currentPage === i + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-gray-700"
                    }`}
                >
                    {i + 1}
                </button>
            ))}
        </div> */}
        {/* <OrderDeleteDialog
            orderIds={selectedIds}
            open={openDialog}
            handleClose={handleCloseDelete}
            size='lg'
            position='center'
            animate={{
                mount: { x: 1, y: 0 },
                unmount: { x: 0.9, y: -100 }
            }}
        /> */}
        
    </>
    );
}

export default OrderList;

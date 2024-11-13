/* eslint-disable react/prop-types */


const OrderTable = ({orders}) => {
    return (
        <>
        <div className='text-lg font-semibold leading-6 py-2 px-2 italic'>
            <h2>Đơn hàng</h2>
        </div>
        
            <table className='border border-slate-900 w-full'>
                <thead className='text-sm uppercase border-b border-slate-900'>
                    
                    <tr>
                        <th>Mã</th>
                        <th>User</th>
                        <th>Trạng Thái</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders.map((item,index)=>(
                            <tr key={index}>
                                <td>{item.orderID}</td>
                                <td>{item.name}</td>
                                <td className={`${item.status === 'Đang xử lý' ? 'text-green-500'
                                    :item.status === 'Chờ thanh toán' ? 'text-orange-500'
                                    :item.status === 'Đơn hủy' ? 'text-red-500'
                                    :item.status === 'Đã hoàn tất' ? 'text-black'
                                    : 'text-yellow-600'
                                    }`}>
                                    {item.status}
                                </td>

                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </>
    );
}

export default OrderTable;

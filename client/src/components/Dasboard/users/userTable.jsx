/* eslint-disable react/prop-types */

const UserTable = ({users}) => {
    return (
        <>
        <table className="w-full border border-slate-900">
            <thead className="text-lg uppercase border-b border-slate-900">
                <tr>
                    <th>Tên</th>
                    <th>SĐT</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    users.map((item,index)=>(
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.phone}</td>
                            <td>
                                {item.status=== 'on'?(
                                    <div className=" w-3 h-3 rounded-full shadow-xl bg-green-600">

                                    </div>
                                ):(
                                    <div className=" w-3 h-3 rounded-full shadow-xl bg-gray-400">

                                    </div>
                                )}
                            </td>

                        </tr>
                    ))
                }
            </tbody>
        </table>
            
        </>
    );
}

export default UserTable;

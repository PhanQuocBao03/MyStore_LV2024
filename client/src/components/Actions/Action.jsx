/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaEdit, FaTrash, FaKey } from "react-icons/fa";
import UserEditDialog from "../../page/Users/UserEditDialog";
import UserDeleteDialog from "../../page/Users/userDeleteDialog";
import EmployeeDeleteDialog from "../../page/Employees/EmployeeDelete";
import EmployeeEdit from "../../page/Employees/EmployeeEdit";
// import ProductEditDialog from "../../page/Products/productEditDialog";
import ProductDeleteDialog from "../../page/Products/productDeleteDialog";

const Action = ({ id, type }) => { // Thêm prop type để phân biệt loại đối tượng (user/employee)
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    

    
    const handleOpenDelete = (id) => {
        setSelectedId(id);
        setOpenDelete(true);
    };
    
    const handleOpenEdit = (id) => {
        setSelectedId(id);
        setOpenEdit(true);
    };
    const handleClose = () => {
        setOpenEdit(false);
        setSelectedId(null);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedId(null);
    };

    return (
        <div className="bg-white shadow-lg rounded-2xl p-3 w-48 z-10">
            <ul className="flex flex-col space-y-2">
                <li 
                    onClick={() => handleOpenEdit(id)} 
                    // onClick ={()=>setOpen(fasle)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                    <FaEdit className="text-blue-500" />
                    <span className="text-sm">Chỉnh sửa</span>
                </li>
                <li 
                    onClick={() => handleOpenDelete(id)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                    <FaTrash className="text-red-500" />
                    <span className="text-sm">Xóa</span>
                </li>
                <li 
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                    <FaKey className="text-yellow-500" />
                    <span className="text-sm">Khóa</span>
                </li>
            </ul>

            {/* Render hộp thoại chỉnh sửa người dùng */}
            {type==='user'&&(<UserEditDialog
                userId={selectedId}
                open={openEdit}
                handleClose={handleClose}
                size="lg"
                position="center"
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
            />)}

            {/* Render hộp thoại xóa người dùng nếu type là 'user' */}
            {type === 'user' && (
                <UserDeleteDialog
                    userId={selectedId}
                    open={openDelete}
                    handleClose={handleCloseDelete}
                    size='lg'
                    position='center'
                    animate={{
                        mount: { x: 1, y: 0 },
                        unmount: { x: 0.9, y: -100 }
                    }}
                />
            )}

            {/* Render hộp thoại xóa nhân viên nếu type là 'employee' */}
            {type === 'employee' && (
                <EmployeeDeleteDialog
                    employeeId={selectedId}
                    open={openDelete}
                    handleClose={handleCloseDelete}
                    size='lg'
                    position='center'
                    animate={{
                        mount: { x: 1, y: 0 },
                        unmount: { x: 0.9, y: -100 }
                    }}
                />
            )}
            {type === 'employee' && (
                <EmployeeEdit
                    employeeId={selectedId}
                    open={openEdit}
                    handleClose={handleClose}
                    size='lg'
                    position='center'
                    animate={{
                        mount: { x: 1, y: 0 },
                        unmount: { x: 0.9, y: -100 }
                    }}
                />
            )}
            {/* {type === 'product' && (
                <ProductEditDialog
                    productId={selectedId}
                    open={openEdit}
                    handleClose={handleClose}
                    size='lg'
                    position='center'
                    animate={{
                        mount: { x: 1, y: 0 },
                        unmount: { x: 0.9, y: -100 }
                    }}
                />
            )} */}
            {type === 'product' && (
                <ProductDeleteDialog
                    productId={selectedId}
                    open={openDelete}
                    handleClose={handleCloseDelete}
                    size='xl'
                    position='center'
                    animate={{
                        mount: { x: 1, y: 0 },
                        unmount: { x: 0.9, y: -100 }
                    }}
                />
            )}
        </div>
    );
};

export default Action;

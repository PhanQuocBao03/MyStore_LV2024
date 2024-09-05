/* eslint-disable react/prop-types */
import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";
import { BASE_URL } from "../../../config";
import { toast } from "react-toastify";
import HashLoader from 'react-spinners/HashLoader';
import closeIcon from "../../assets/images/close.png"

import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";
const EmployeeAddDialog = ({open, handleClose})=>{
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewURL, setPriviewURL] = useState("")
    const [formData,setFormData] = useState({
        name:'',
        email:'',
        password:'',
        phone:'',
        address:'',
        photo: selectedFile,
        role:'employee',
        gender:''

    });
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const handleInputChange = e =>{
        setFormData ({... formData, [e.target.name]: e.target.value});
    }
    const handleFileInputChange = async (event) =>{
        const file = event.target.files[0];
        const data = await uploadImageToCloudinary(file);
        
        setPriviewURL(data.url);
        setSelectedFile(data.url);
        setFormData({ ... formData, photo: data.url});

       
    }
    const submitHandler = async (event)=>{
       
        event.preventDefault();
         setLoading(true);
         try {
            const res = await fetch(`${BASE_URL}/auth/register`,{
                method: 'post',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                
            })
            const {message} = await res.json();

            if(!res.ok){
                throw new Error(message)
            }
            setLoading(false);
            handleClose();
            navigate('/employee')
            toast.success(message);
         } catch (error) {
            toast.error(error.message);
            setLoading(false);
         }
    };
    
    return(
        <Dialog
        size="lg"
        open={open}
        handler={handleClose}
        animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
      className="mx-auto max-w-lg border border-gray-300 shadow-2xl bg-white"
    >
    <form action="" onSubmit={submitHandler}>

      <DialogHeader className="  text-white justify-center text-[16px] bg-blue-400 rounded-t-lg">
                <h3 className="text-headingColor text-[22px] leading-9 font-bold ">Thêm 
                <span className="text-primaryColor"> Nhân viên </span></h3>
                <div className=" absolute top-2 right-2">
                        <img src={closeIcon} onClick={handleClose} className='w-5 h-5' alt="" />
                        
                </div>
      </DialogHeader>
      <DialogBody className="p-2">
        <div className="max-w-[1170px] mx-auto">
                
            <div className="rounded-l-lg lg:pl-16 py-10">
                    <div className="mb-5 items-center gap-3 flex">
                        {selectedFile && <figure className="w-[60px] h-[60px]  rounded-full  border-2 border-solid border-primaryColor
                        flex items-center justify-content">
                            <img src={previewURL} alt="" className="w-full rounded-full"/>
                        </figure>}
                        <div className="relative w-[130px] h-[50px]">
                            <input type="file"
                            name="photo"
                            id="customfile"
                            accept=".jpg, .png"
                            onChange={ handleFileInputChange}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
                            <label htmlFor="customfile"className="absolute top-0 left-0 w-full h-full
                            flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor
                            font-semibold rounded-lg truncate    cursor-pointer">Thêm ảnh</label>
                        </div>

                    </div>
                    <div className="mb-5">
                        <input type="text" name="name" placeholder="Họ và tên" 
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pr-4  py-3 text-[16px] bord focus:outline-none border-b border-solid border-[#0066ff61]" 
                        id="" required />
                    </div>
                    <div className="mb-5">
                        <input type="email" name="email" placeholder="Địa chỉ email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pr-4  py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none
                        placeholder:text-textColor  cursor-pointer" 
                        id="" required/>
                    </div>
                    <div className="mb-5 ">
                            <input 
                                type="number" 
                                name="phone" 
                                placeholder="Nhập SĐT" 
                                value={formData.phone}
                                onChange={handleInputChange}
                                id='' required
                                className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none placeholder:text-textColor cursor-pointer" 
                            />
                    </div>
                    <div className="mb-5">
                        <input type="text" name="address" placeholder="Địa chỉ" 
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pr-4  py-3 text-[16px] bord focus:outline-none border-b border-solid border-[#0066ff61]" 
                        id="" required />
                    </div>
                    <div className="mb-5">
                        <input type="password" name="password" placeholder="Mật khẩu" 
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pr-4  py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none
                        placeholder:text-textColor  cursor-pointer" 
                        id="" required/>
                    </div>
                    <div className="flex items-center justify-between">
                        {/* <label htmlFor=""
                            className="text-headingColor font-bold text-[16px] leading-7">
                            Are you a:
                            <select name="role" 
                            className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-one"
                            id=""
                            value={formData.role}
                        onChange={handleInputChange}>
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                            </select>
                        </label> */}
                        <label htmlFor=""
                            className="text-headingColor font-bold text-[16px] leading-7">
                            Giới tính:
                            <select 
                                name="gender" 
                                className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-one"
                                id=""
                                value={formData.gender}
                        onChange={handleInputChange}>
                                    <option value="">Chọn giới tính</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                            </select>
                        </label>
                    </div>
                    
                    
            </div>
              
        </div>
      </DialogBody>
      <DialogFooter>
            <div className="m-0">
                <button 
                disabled = {loading && true}
                type="submit" className="w-full bg-primaryColor  text-white text-[18px] leading-[30px] rounded-lg px-4 py-3">
                    {loading ? <HashLoader size={35} color="#ffffff"/>:'Đăng ký'}
                </button>
            </div>
            
      </DialogFooter>
      </form>

    </Dialog>
    )
}
export default EmployeeAddDialog;

import { useState } from "react";
import SignupImg from '../assets/images/signup.gif';
// import avatar from '../assets/images/avatar-icon.png'
import { Link, useNavigate } from "react-router-dom";
import uploadImageToCloudinary from "../utils/uploadCloudinary";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import HashLoader from 'react-spinners/HashLoader';

const Register = () => {
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewURL, setPreviewURL] = useState("")
    const [formData,setFormData] = useState({
        name:'',
        email:'',
        password:'',
        photo: selectedFile,
        role:'user',
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
        
        setPreviewURL(data.url);
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
            toast.success(message);
            navigate('/login')
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    };
    return (
        <section className="px-5 xl:px-0">
        <div className="max-w-[1170px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="hidden lg:block bg-primaryColor rounded-l-lg">
                    <figure className="rounded-l-lg ">
                        <img src={SignupImg} alt="" className="w-full rounded-l-lg"/>
                    </figure>
                </div>
                <div className="rounded-l-lg lg:pl-16 py-10">
                    <h3 className="text-headingColor text-[32px] leading-9 font-bold mb-10">Tạo tài khoản mới 
                    <span className="text-primaryColor"> ngay bây giờ</span></h3>
                    <form action="" onSubmit={submitHandler}>
                        <div className="mb-5">
                            <input type="text" name="name" placeholder="Họ và tên" 
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pr-4  py-3 text-[18px] border-b border-solid border-[#0066ff61] focus:outline-none" 
                            id="" required />
                        </div>
                        <div className="mb-5">
                            <input type="email" name="email" placeholder="Nhập email của bạn" 
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pr-4  py-3 text-[18px] border-b border-solid border-[#0066ff61] focus:outline-none" 
                            id="" required/>
                        </div>
                        <div className="mb-5">
                            <input type="password" name="password" placeholder="Mật khẩu" 
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full pr-4  py-3 text-[18px] border-b border-solid border-[#0066ff61] focus:outline-none" 
                            id="" required/>
                        </div>
                        <div className="mb-5 flex items-start justify-left">
                
                            <label htmlFor="" className="text-headingColor font-bold text-[18px] leading-7">
                                Giới tính:
                                <select 
                                    name="gender" 
                                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-one"
                                    id=""
                                    value={formData.gender}
                                    onChange={handleInputChange}>
                                        <option value="">Chọn</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                </select>
                            </label>
                        </div>
                        <div className="mb-5 items-center gap-3 flex">
                            {selectedFile && 
                            <figure className="w-[60px] h-[60px]  rounded-full  border-2 border-solid border-primaryColor
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
                                font-semibold rounded-lg truncate    cursor-pointer">Tải ảnh lên</label>
                            </div>

                        </div>
                        <div className="mt-7">
                            <button 
                            disabled = {loading && true}
                            type="submit" className="w-full bg-primaryColor  text-white text-[18px] leading-[30px] rounded-lg px-4 py-3">
                                {loading ? <HashLoader size={35} color="#ffffff"/>:'Đăng ký'}
                            </button>
                        </div>
                        <p className="mt-5 text-textColor text-center text-[18px]">
                            Đã có tài khoản ? <Link to='/login'className=" text-primaryColor font-medium ml-1">Đăng nhập</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
    );
}

export default Register;

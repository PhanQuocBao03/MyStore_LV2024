/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";
import { BASE_URL, token } from "../../../config";
import { toast } from "react-toastify";
import HashLoader from 'react-spinners/HashLoader';

const Profile = ({ user }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        photo: null,
        gender: '',
        phone: '',
        address: ''
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Set initial data from the user prop
    useEffect(() => {
        setFormData({
            name: user.name,
            email: user.email,
            photo: user.photo,
            gender: user.gender,
            phone: user.phone,
            address: user.address,
        });
    }, [user]);

    const handleInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file input change and upload to Cloudinary
    const handleFileInputChange = async (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            const data = await uploadImageToCloudinary(file);
            setSelectedFile(data.url);
            setFormData({ ...formData, photo: data.url });
        } else {
            toast.error("Vui lòng chọn file ảnh có định dạng .jpg hoặc .png");
        }
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/users/${user._id}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Cập nhật thông tin thất bại");
            }
            setLoading(false);
            toast.success(data.message);
            navigate('/users/profile/me');
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="mt-10">
            <form onSubmit={submitHandler}>
                {/* Name Input */}
                <div className="mb-5">
                    <input
                        type="text"
                        name="name"
                        placeholder="Họ và Tên"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pr-4 py-3 text-[16px] border-b border-solid focus:outline-none placeholder:text-textColor cursor-pointer"
                        required
                    />
                </div>

                {/* Email Input */}
                <div className="mb-5">
                    <input
                        type="email"
                        name="email"
                        placeholder="Nhập email..."
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none placeholder:text-textColor cursor-pointer"
                        readOnly
                    />
                </div>

                {/* Phone Input */}
                <div className="mb-5">
                    <input
                        type="number"
                        name="phone"
                        placeholder="Số điện thoại.."
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none placeholder:text-textColor cursor-pointer"
                        readOnly
                    />
                </div>

                {/* Address Input */}
                <div className="mb-5">
                    <input
                        type="text"
                        name="address"
                        placeholder="Địa chỉ"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none placeholder:text-textColor cursor-pointer"
                        readOnly
                    />
                </div>

                {/* Password Input */}
                <div className="mb-5">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none placeholder:text-textColor cursor-pointer"
                    />
                </div>

                {/* Gender Select */}
                <div className="mb-5 flex items-center justify-between">
                    <label htmlFor="" className="text-headingColor font-bold text-[16px] leading-7">
                        Giới tính:
                        <select
                            name="gender"
                            className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                            value={formData.gender}
                            onChange={handleInputChange}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </label>
                </div>

                {/* Photo Upload */}
                <div className="mb-5 flex items-center gap-3">
                    {formData.photo && (
                        <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                            <img src={formData.photo} alt="User Avatar" className="w-full rounded-full" />
                        </figure>
                    )}
                    <div className="relative w-[130px] h-[50px]">
                        <input
                            type="file"
                            name="photo"
                            id="customfile"
                            accept=".jpg, .png"
                            onChange={handleFileInputChange}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <label
                            htmlFor="customfile"
                            className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                        >
                            {selectedFile ? selectedFile.name : 'Tải ảnh'}
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-7">
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                    >
                        {loading ? <HashLoader size={25} color="#ffffff" /> : 'Lưu'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;

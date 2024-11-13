import {useContext,useState} from "react";
import { authContext } from "../../context/AuthContext";
import MyOrder from "./MyOrder";
import Profile from "./Profile";
import { BASE_URL, token } from "../../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import useFetchData from "../../Hook/userFecthData";
import { useNavigate } from "react-router-dom";
// import Patient from "./Patient";


const Account = ()=>{
    const {dispatch,user} = useContext(authContext);
    const [tab,setTab] = useState('orders');
    const navigate = useNavigate()

    const {data:userData, loading, error} = useFetchData(`${BASE_URL}/user/${user._id}`);

    const handleLogout = async () => {
   

        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            try {
                // Gọi API để cập nhật trạng thái đăng xuất trong cơ sở dữ liệu
                const res = await fetch(`${BASE_URL}/auth/logout`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId: userData._id }), // Gửi userId trong body
                });
    
                if (!res.ok) {
                    throw new Error("Không thể đăng xuất từ máy chủ.");
                }
    
                // Cập nhật AuthContext và localStorage
                dispatch({ type: 'LOGOUT' });
                navigate("/login");
            } catch (error) {
                console.error("Đăng xuất thất bại:", error);
            }
        }
    };
    return(
       <section>
            <div className="max-w-[1170px] mx-auto px-5">
                {loading &&!error && <Loading />}
                {error&&!loading && <Error errorMessage = {error}/>}
                {
                    !loading && !error && (
                        <div className="grid md:grid-cols-3 gap-10">
                            <div className="pb-[50px] px-[30px] rounded-md">
                                <div className="flex items-center justify-center">
                                    <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor">
                                        <img src={userData.photo} className="w-full h-full rounded-full" alt="" />
                                    </figure>
                                </div>
                                <div className="text-center mt-4 ">
                                    <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">
                                        {userData.name}
                                    </h3>
                                    <p className="text-textColor text-[15px] font-medium leading-6">
                                       {userData.email}
                                    </p>
                                    
                                </div>
                                <div className="text-center mt-4 flex gap-2 items-center justify-center">
                                    <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">Điểm:</h3>
                                    <p>{userData.point}</p>

                                </div>
                                <div className="mt-[50px] md:mt-[100px]">
                                    <button className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white" onClick={handleLogout}>Đăng Xuất</button>
                                    <button className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white">Xóa Tài Khoản</button>
                                </div>
                                
                            </div>
                            <div className="md:col-span-2 md:px-[30px]">
                                <div >
                                    <button onClick={()=> setTab('orders')}
                                    className={` ${
                                        tab==="orders"&& "bg-primaryColor text-white font-normal"
                                    }p-2 mr-5 px-5 rounded-md text-headingColor font-semiblod text-[16px] leading-7
                                    border border-solid border-primaryColor`}>Đơn hàng</button>
                                    <button onClick={() => setTab('settings')}
                                    className={`${
                                        tab === "settings" && "bg-primaryColor text-white font-normal"
                                    }py-2 mr-5 px-5 rounded-md text-headingColor font-semiblod text-[16px] leading-7
                                    border border-solid border-primaryColor`}>Cài đặt</button>
                                    
                                </div>
                                {tab === 'orders' && <MyOrder user={user._id} />}
                                {tab === 'settings' && <Profile user = {userData} />}
                                {/* {tab === 'patients' && <Patient userData = {userData} />} */}
                            </div>
                        </div>
                    )
                }
            </div>
       </section>
    )
};

export default Account;
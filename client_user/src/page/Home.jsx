import useFetchData from "../../../client/src/Hook/userFecthData";
import { BASE_URL } from "../../config";
import { BiCategory } from "react-icons/bi";
import ProductList from "../components/Products/ProductList";
import imgSamSung from "../assets/images/samsung.jpg"
import imgTosiba from "../assets/images/banasonic.png";
import imgPn1 from "../assets/images/pn1.png";
import imgPn2 from "../assets/images/pn2.png";
import img1 from "../assets/images/img1.jpg";
import img2 from "../assets/images/img2.jpg";
import img4 from "../assets/images/img4.jpg";
import img3 from "../assets/images/img3.jpg";
import img5 from "../assets/images/img5.jpg";
import img6 from "../assets/images/img6.jpg";
import img7 from "../assets/images/img7.jpg";
import img8 from "../assets/images/img8.jpg";
import { useState } from "react";

const Home = () => {
    const { data: categories } = useFetchData(`${BASE_URL}/category`);
    const [tab, setTab] = useState("sales");
    

    return (
        <div className="w-full bg-slate-100">
            <div className="mx-[160px] pt-5">
                <div className=" bg-white rounded-lg grid lg:grid-cols-8 sm:grid-cols-4 h-[200px] max-h-[400px] overflow-y-auto">
                    {categories.slice(0, 15).map((item, index) => ( // Giới hạn 16 mục, hiển thị tối đa 2 hàng
                        <div key={index} className="flex-col items-center hover:bg-slate-200 py-3">
                            <div className="w-[50px] mx-auto">
                                <img src={item.photo} alt="" />
                            </div>
                            <p className="text-center">{item.name}</p>
                        </div>
                    ))}
                    <div className="flex-col items-center justify-center">
                        <div className="w-[50px] text-[50px] items-center mx-auto text-primaryColor">
                            <BiCategory />
                        </div>
                        <p className="text-center">Tất cả danh mục</p>
                    </div>
                </div>
                <div className="mt-5">
                    <h2 className="text-[20px]  leading-6 font-semibold mb-5">Hàng khuyến mãi</h2>
                    <div className=" bg-white rounded-lg py-5 px-8">
                        <ProductList />
                    </div>
                </div>
                <div className="mt-5">
                    <div className=" bg-white rounded-lg py-5 px-8">
                    <h2 className="text-[20px]  leading-6 font-semibold mb-5">Gợi ý dành cho bạn</h2>
                        <ProductList />
                    </div>
                </div>
                <div className="mt-5">
                    <h2 className="text-[20px]  leading-6 font-semibold mb-5">Gian hàng ưu đãi</h2>

                    <div className="flex gap-5">
                        <img className="w-[285px]" src={imgSamSung} alt="" />
                        <img className="w-[285px]" src={imgTosiba} alt="" />
                        <img className="w-[285px]" src={imgPn1} alt="" />
                        <img className="w-[285px]" src={imgPn2} alt="" />
                    </div>

                </div>
               
                <div className="mt-5">
                    <div className=" bg-white rounded-lg py-5 px-8">
                        <h2 className="text-[20px]  leading-6 font-semibold mb-5">Bản tin</h2>
                        <div className="flex gap-2 mb-2">
                            <div className={`border-2  rounded-lg py-2 px-3 cursor-pointer ${tab === 'sales' ? 'border-primaryColor' : 'border-slate-500'}`} onClick={() => setTab("sales")}>
                                <p>Khuyến mãi</p>
                            </div>
                            <div className={`border-2  rounded-lg py-2 px-3 cursor-pointer ${tab === 'support' ? 'border-primaryColor' : 'border-slate-500'}`} onClick={() => setTab("support")}>
                                <p>Tư vấn chọn mua</p>
                            </div>

                        </div>
                        <div className="h-[250px]">
                            {
                                tab === 'sales' && (

                                    <div>
                                        <div className="grid grid-cols-4 gap-3">
                                            <div className="">

                                                <img src={img1} className="rounded-md" alt="" />
                                                <p className="text-left text-[16px] leading-5 mt-3">Sale to Giá rẻ - Duy nhất 16/11 - Miễn phí Nồi chiên không dầu Kangaroo 4.350 triệu - Mua Nồi Inox đáy từ chỉ 50K</p>
                                            </div>
                                            <div className="">

                                                <img src={img2} className="rounded-md" alt="" />
                                                <p className="text-left text-[16px] leading-5 mt-3">Minigame: Săn coupon Chưa người yêu XANH sẽ chiều - Nhận ngay mã giảm đến 1.5 triệu đồng</p>
                                            </div>
                                            <div className="">

                                                <img src={img3} className="rounded-md" alt="" />
                                                <p className="text-left text-[16px] leading-5 mt-3">Khuyến mãi Laptop, Máy tính bảng dành riêng cho Học sinh - Sinh viên, giảm thêm đến 500K</p>
                                            </div>
                                            <div className="">

                                                <img src={img4} className="rounded-md" alt="" />
                                                <p className="text-left text-[16px] leading-5 mt-3">11.11 Chưa người yêu XANH sẽ chiều - Gia dụng ONLINE giảm đến 50% - Săn mã giảm đến 1.5 triệu đồng</p>
                                            </div>
                                        </div>
                                        <div className="text-center text-primaryColor">
                                            <p className="cursor-pointer">Xem thêm</p>
                                        </div>

                                    </div>
                                )
                            }
                            {
                                tab==='support'&&(
                                    <div>
                                        <div className="grid grid-cols-4 gap-3">
                                            <div className="">

                                                <img src={img5} className="rounded-md" alt="" />
                                                <p className="text-left text-[16px] leading-5 mt-3">Top 10 máy lọc không khí tốt nhất hiện nay cho gia đình của bạn</p>
                                            </div>
                                            <div className="">

                                                <img src={img6} className="rounded-md" alt="" />
                                                <p className="text-left text-[16px] leading-5 mt-3">Top 5 nồi chiên không dầu 12 lít tiện lợi, giá tốt nhất đáng mua</p>
                                            </div>
                                            <div className="">

                                                <img src={img7} className="rounded-md" alt="" />
                                                <p className="text-left text-[16px] leading-5 mt-3">Chọn tivi nào để phòng ngủ? Top 5 tivi 32 inch giá rẻ đáng mua nhất hiện nay</p>
                                            </div>
                                            <div className="">

                                                <img src={img8} className="rounded-md" alt="" />
                                                <p className="text-left text-[16px] leading-5 mt-3">Bảng giá iPhone Mới - Cũ hiện nay mới nhất tháng 11/2024</p>
                                            </div>
                                        </div>
                                        <div className="text-center text-primaryColor">
                                            <p className="cursor-pointer">Xem thêm</p>
                                        </div>

                                    </div>

                                )
                            }
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Home;

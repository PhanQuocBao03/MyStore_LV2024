
import { Link } from "react-router-dom";
import logo from '../../assets/images/logo.png';
import {AiFillFacebook, AiFillGithub, AiFillInstagram} from 'react-icons/ai';

const socialLinks = [
    {
        path:"/home",
        icon:<AiFillGithub className="group-hover:text-white w-4 h-5" />
    },
    {
        path:"https://www.facebook.com/QuocBao0302?locale=vi_VN",
        icon:<AiFillFacebook className="group-hover:text-white w-4 h-5" />
    },
    {
        path:"/",
        icon:<AiFillInstagram className="group-hover:text-white w-4 h-5" />
    },
]
const quickLink01=[
    {
        path:"/home",
        display:"Trang chủ"
    },
    {
        path:"/",
        display:"Giới thiệu"
    },
    // {
    //     path:"/services",
    //     display:"Services"
    // },
    {
        path:"/",
        display:"Bài viết"
    },
];
const quickLink02=[
    {
        path:"/product",
        display:"Tìm sản phẩm"
    },
    {
        path:"/",
        display:"Bảo hành"
    },
    {
        path:"/",
        display:"Tìm đơn hàng"
    },
    {
        path:"/",
        display:"Góp ý"
    },
];
const quickLink03=[
    {
        path:"/",
        display:"Donates"
    },
    {
        path:"/contact",
        display:"Tư vấn"
    },
    
];

const Footer = () =>{
    const year = new Date().getFullYear()
    return (
        <footer className="pb-0">
            <div className="container">
                <div className="pt-5 flex justify-around bg-slate-300 flex-col md:flex-row flex-wrap gap-[30px]">
                    <div>
                        <img src={logo} alt="" />
                        <p className="text-[16px] leading-7 font-[40px] text-textColor">Copyright © {year} Phan Quốc Bảo B2005745 </p>
                        <div className="flex items-center gap-3 mt-4">
                            {socialLinks.map((link,index)=> (
                            <Link to={link.path} key={index} className="w-9 h-9 border border-[#181A1E] rounded-full flex items-center justify-center
                            group hover:bg-primaryColor hover:border-none">
                                {link.icon}
                            </Link>
                            ))}
                        </div>

                    </div>
                    <div>
                        <h2 className="text-[20px] leading-[30px] font-[700] mb-6 text-headingColor">Điều hướng</h2>
                        <ul>
                            {quickLink01.map((item,index)=>(
                                <li key={index} className="mb-4">
                                    <Link to={item.path} className="text-[16px] leading-7 font-[400] text-textColor">{item.display}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-[20px] leading-[30px] font-[700] mb-6 text-headingColor">Bạn muốn:</h2>
                        <ul>
                            {quickLink02.map((item,index)=>(
                                <li key={index} className="mb-4">
                                    <Link to={item.path} className="text-[16px] leading-7 font-[400] text-textColor">{item.display}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-[20px] leading-[30px] font-[700] mb-6 text-headingColor">Hỗ trợ</h2>
                        <ul>
                            {quickLink03.map((item,index)=>(
                                <li key={index} className="mb-4">
                                    <Link to={item.path} className="text-[16px] leading-7 font-[400] text-textColor">{item.display}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
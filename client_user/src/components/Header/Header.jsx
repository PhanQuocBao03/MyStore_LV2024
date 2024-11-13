import { useEffect, useRef, useContext, useState } from "react";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import { GrCart } from "react-icons/gr";


import { BiMenu } from 'react-icons/bi';
import { authContext } from "../../context/AuthContext";
import useFetchData from "../../../../client/src/Hook/userFecthData";
import { BASE_URL } from "../../../config";
import Cart from "../Cart/Cart";



const Headers = () => {
    const { data: categories } = useFetchData(`${BASE_URL}/category`);
    const [labelGroup, setLabelGroup] = useState("Điện tử,điện máy");
    const categorieWithGroup = categories.filter(cte => cte.group === labelGroup);
    const headerRef = useRef(null)

    const { user, token } = useContext(authContext);
    const [openCart, setOpenCart] = useState(false);
    const toggleCart = () => {
        setOpenCart(prevState => !prevState); // Đảo ngược trạng thái giỏ hàng
    };


    const handleStickyHeader = () => {
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
                headerRef.current.classList.add('sticky__header')
            }
            else {
                headerRef.current.classList.remove('sticky__header')
            }
        })
    }
    useEffect(() => {
        handleStickyHeader()
        return () => window.removeEventListener('scroll', handleStickyHeader)
    });



    return (
        <header className="header flex items-center " ref={headerRef}>
            <div className="container">
                <div className="flex items-center justify-center">
                    {/* Logo */}
                    <div className="flex items-center gap-9 ">
                        <Link to='/home'>

                            <img src={logo} alt="Logo" className="h-12" />
                        </Link>

                        {/* Mục Danh mục */}
                        <div className="relative group">
                            <div className="flex items-center gap-1 hover:bg-gray-200 hover:rounded-t-2xl px-3 h-[50px] cursor-pointer">
                                <BiMenu className="w-6 h-6" />
                                <p>Danh mục</p>
                            </div>

                            {/* Dropdown Menu */}
                            <div className="absolute left-0 w-[820px] bg-white shadow-lg  h-[300px] top-[50px] 
                                        rounded-lg hidden opacity-0 group-hover:opacity-100 group-hover:block 
                                         transition-opacity duration-300">
                                <div className="grid grid-cols-3">
                                    <div className="bg-gray-100 pr-2 col-span-1">
                                        <ul className="max-h-screen bg-gray-200  ">
                                            <li className="border h-[50px] itemLi px-5 pt-[10px] border-slate-300 border-r-0 leading-6 cursor-pointer" onMouseEnter={() => setLabelGroup("Điện tử,điện máy")}>Điện tử, Điện máy</li>
                                            <li className="border h-[50px] itemLi px-5 pt-[10px] border-slate-300 border-r-0 leading-6 cursor-pointer" onMouseEnter={() => setLabelGroup("Đồ gia dụng")}>Điện gia dụng</li>
                                            <li className="border h-[50px] itemLi px-5 pt-[10px] border-slate-300 border-r-0 leading-6 cursor-pointer" onMouseEnter={() => setLabelGroup("Điện tử , Viễn thông")} >Điện tử, Viễn thông</li>
                                            <li className="border h-[50px] itemLi px-5 pt-[10px] border-slate-300 border-r-0 leading-6 cursor-pointer" onMouseEnter={() => setLabelGroup("Phụ kiện")}>Phụ kiện</li>
                                            <li className="border h-[50px] itemLi px-5 pt-[10px] border-slate-300 border-r-0 leading-6 cursor-pointer" onMouseEnter={() => setLabelGroup("Điện tử , Viễn thông")}>Sản phẩm khác</li>
                                            <li className="border h-[50px] itemLi px-5 pt-[10px] border-slate-300 border-r-0 leading-6 cursor-pointer" onMouseEnter={() => setLabelGroup("Điện tử , Viễn thông")}>Thông tin</li>
                                        </ul>
                                    </div>
                                    <div className="col-span-2 grid grid-cols-6 gap-5 mx-5 mt-5 ">
                                        {
                                            categorieWithGroup.map((items, index) => (
                                                <Link to={`/product?category=${encodeURIComponent(items.name)}`}
                                                    key={index}
                                                    className="col-span-1 hover:bg-blue-100 h-[110px] 
                                                hover:text-primaryColor items-center"
                                                >
                                                    <img src={items.photo} alt="" />
                                                    <p className="text-center leading-5 text-[13px]">{items.name}</p>

                                                </Link>
                                            ))
                                        }


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative max-w-lg mx-7">
                        <input
                            type="search"
                            placeholder="Tìm kiếm..."
                            // value={query}
                            // onChange={e => setQuery(e.target.value)}
                            className="w-[300px] h-2/3 p-2 pl-10 border rounded-3xl border-gray-300 focus:outline-none"
                        />
                        <button className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                            <FaSearch />
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-5">
                        {
                            token && user ? <div >
                                <Link to='users/profile/me' className="flex items-center justify-center gap-3">
                                    <figure className="w-[25px] h-[25px] rounded-full cursor-pointer">
                                        <img src={user.photo} className="w-full rounded-full" alt="" />

                                    </figure>
                                    <h2>{user.name}</h2>
                                </Link>
                            </div> : <Link to='/login' className="flex gap-2 items-center justify-center">
                                <FaUser />
                                <span>Đăng nhập</span>
                            </Link>
                        }

                        <div className="relative">
                            <div className="flex gap-2 items-center justify-center cursor-pointer" onClick={toggleCart}>
                                <GrCart />
                                <span>Giỏ hàng</span>
                            </div>
                            <div
                                className={`absolute  w-[384px] bg-white shadow-2xl  top-[85px] -right-[280px] transform transition-all duration-300 ease-in-out ${openCart ? 'scale-100 opacity-100 translate-x-0' : 'scale-90 opacity-0 translate-x-full'
                                    }`}
                            >
                                <Cart />
                            </div>
                        </div>


                    </div>


                    {/* ==========Nav right============== */}
                    {/* <div className="flex itmes-center gap-4">
                        {
                            token && user ? <div >
                                <Link to={`${role === 'user' ? '/doctors/profile/me' : '/users/profile/me'}`}>
                                    <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                                        <img src={user?.photo} className="w-full rounded-full" alt="" />

                                    </figure>
                                    
                                </Link>
                            </div> : <Link to='/login'>
                                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center
                            justify-center rounded-[50px] ">Login</button>
                            </Link>
                        }




                    </div> */}
                </div>
            </div>
        </header>
    );
}

export default Headers;
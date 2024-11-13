/* eslint-disable react/prop-types */
import { useContext, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from 'react-icons/fa';
import { authContext } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";
import miniLogo from "../../assets/images/miniLogo.png";
import control from "../../assets/images/control.png";
import chartFill from "../../assets/images/Chart_fill.png";
import productImg from "../../assets/images/product.png";
import orderImg from "../../assets/images/order.png";
import userImg from "../../assets/images/User.png";
import settingImg from "../../assets/images/Setting.png";
import employee from '../../assets/images/employees.png';
import repair from '../../assets/images/repair.png';
import sales from '../../assets/images/sale.png';
import comment from '../../assets/images/Chat.png';
import whouse from '../../assets/images/whouse.png';
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { BASE_URL, token } from "../../../config";

const navLinks = [
  { path: '/dashboard', display: 'Thống kê', src: chartFill },
  { path: '/user', display: 'Khách hàng', src: userImg },
  { path: '/employee', display: 'Nhân viên', src: employee },
  { path: '/product', display: 'Sản phẩm', src: productImg, gap: true },
  { path: '/order', display: 'Đơn hàng', src: orderImg },
  { path: '/warehouse', display: 'Kho hàng', src: whouse, accordionId: 1 },
  { path: '/warehouse/categories', display: 'Danh mục', isSubItem: true },
  { path: '/warehouse/suppliers', display: 'Nhà cung cấp', isSubItem: true },
  { path: '/promotion', display: 'Khuyến mãi', src: sales },
  { path: '/warranty', display: 'Bảo hành', src: repair },
  { path: '/feedback', display: 'Phản hồi', src: comment, gap: true },
  { path: '/setting', display: 'Cài đặt', src: settingImg }
];

// NavItem với kiểm tra thêm để phân biệt mục con
const NavItem = ({ path, display, src, gap, isSidebarOpen, accordionId, onAccordionClick, isSubItem }) => (
  <li className={`item-sideBar ${isSubItem ? "ml-6" : ""}`}>
    <NavLink
      to={path}
      onClick={(e) => {
        if (accordionId !== undefined) {
          e.preventDefault();
          onAccordionClick(accordionId);
        }
      }}
      className={`text-l group relative flex items-center gap-x-4 cursor-pointer p-2 ${gap ? "mt-9" : "mt-2"}`}
    >
      {src && <img src={src} className="w-4 h-4" alt={display} />}
      <span className={`${!isSidebarOpen && "hidden"} origin-left duration-300`}>
        {display}
      </span>
    </NavLink>
  </li>
);

const LeftSideBar = () => {
  const users = useMemo(() => JSON.parse(localStorage.getItem('user')), []);

  const { dispatch } = useContext(authContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeAccordionId, setActiveAccordionId] = useState(0);

  // Xử lý đăng xuất
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
                body: JSON.stringify({ userId: users._id }), // Gửi userId trong body
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

  // Xử lý mở/đóng Accordion
  const toggleAccordion = (accordionId) => {
    // Nếu Accordion đang mở, đóng lại mà không điều hướng
    if (activeAccordionId === accordionId) {
      setActiveAccordionId(0);
    } else {
      setActiveAccordionId(accordionId);
      if (accordionId === 1) navigate("/warehouse");
    }
  };

  return (
    <section
    id="leftSideBar"
      className={`relative p-5 pt-8 duration-300 bg-primaryColor text-white ${isSidebarOpen ? "w-52" : "w-20 "}`}
    >
      <img
        src={control}
        className={`absolute cursor-pointer rounded-full -right-3 top-[325px] w-7 border-2 bg-white ${!isSidebarOpen ? "rotate-180" : ""}`}
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        alt="Chuyển đổi điều khiển"
      />
      <div className="mb-6" onClick={()=> setActiveAccordionId(0)}>
        {isSidebarOpen ? (
          <img src={logo} alt="Logo" className="w-auto" />
        ) : (
          <img src={miniLogo} alt="Logo nhỏ" className="w-12" />
        )}
      </div>
      <hr />
      <nav className="navigation hidden md:block" >
        <ul className="py-2">
          {navLinks.map((link, index) => {
            if (link.accordionId === 1) {
              return (
                <Accordion
                  key={index}
                  open={activeAccordionId === link.accordionId}
                  icon={
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={`h-4 w-4 transition-transform ${activeAccordionId === link.accordionId ? "rotate-180" : ""} ${!isSidebarOpen && "hidden w-0"  }`}
                    />
                  }
                >
                  <ListItem className="p-0" selected={activeAccordionId === link.accordionId}>
                    <AccordionHeader onClick={() => toggleAccordion(link.accordionId)} className="border-b-0 px-2">
                      <ListItemPrefix className="mr-0">
                        <img src={whouse} className="w-4 h-4" alt="" />
                      </ListItemPrefix>
                      <Typography  className={`${!isSidebarOpen && "hidden"} mr-auto ml-4 text-[16px]  font-normal text-white `}>
                        {link.display}
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                  <AccordionBody  className="py-0">
                    <List className=" text-white ml-5 p-0">
                      {navLinks
                        .filter((subLink) => subLink.isSubItem && subLink.path.includes('/warehouse'))
                        .map((subLink, subIndex) => (
                          <NavItem
                            key={subIndex}
                            path={subLink.path}
                            display={subLink.display}
                            isSubItem={true}
                            isSidebarOpen={isSidebarOpen}
                          />
                        ))}
                    </List>
                  </AccordionBody>
                </Accordion>
              );
            } else if (!link.isSubItem) {
              return (
                <NavItem
                  key={index}
                  path={link.path}
                  display={link.display}
                  src={link.src}
                  gap={link.gap}
                  isSidebarOpen={isSidebarOpen}
                  accordionId={link.accordionId}
                  onAccordionClick={toggleAccordion}
                />
              );
            }
            return null;
          })}
          <hr />
          <li
            className="py-3 flex items-center gap-2 text-[16px] px-2 font-medium cursor-pointer"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-gray-600" />
            Đăng xuất
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default LeftSideBar;

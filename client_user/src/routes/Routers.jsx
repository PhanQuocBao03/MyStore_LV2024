import Login from "../page/Login";
import Products from "../page/products";
import Register from "../page/Register";
import Home from "../page/Home";
import Cart from "../page/Cart";
import Payment from "../page/payment";
import Account from "../page/user/Account";


import {Routes,Route}from "react-router-dom";
const Routers = () => {
    return (
        <Routes>
        <Route path="/home" element={<Home/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/checkout" element={<Payment/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/product" element={<Products/>} />
        <Route path="/users/profile/me" element={<Account/>} />
        </Routes>
    );
}

export default Routers;

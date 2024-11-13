import Dashboard from "../page/Dashboard/Dashboard"
import Login from "../page/Login";
import Register from "../page/Signup"
// import ProtectedRoute from "./ProtectedRoute";
import Orders from "../page/Orders/Order";
import Employees from "../page/Employees/Employee";
import Product from "../page/Products/Product";
import Users from "../page/Users/User";
import Promotions from "../page/Promotions/promotion";
import Warranty from "../page/Warranty/warranty";
import Warehouse from "../page/Warehouses/warehouse";
import WarehouseCategory from "../page/Warehouses/category/category";
import WarehouseManu from "../page/Warehouses/manufacture/manufacture";



import {Routes,Route}from "react-router-dom"
const Routers = () => {
    return <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/product" element={<Product/>} />
        <Route path="/user" element={<Users/>} />
        <Route path="/employee" element={<Employees/>} />
        <Route path="/order" element={<Orders/>} />
        <Route path="/promotion" element={<Promotions/>} />
        <Route path="/warranty" element={<Warranty/>} />
        <Route path="/warehouse" element={<Warehouse/>} />
        <Route path="/warehouse/categories" element={<WarehouseCategory/>} />
        <Route path="/warehouse/suppliers" element={<WarehouseManu/>} />

    </Routes>
}

export default Routers;

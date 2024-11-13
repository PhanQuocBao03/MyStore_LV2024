import { useLocation } from "react-router-dom";
import useFetchData from "../../../client/src/Hook/userFecthData";
import { BASE_URL } from "../../config";


const Products = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    const{data:products} = useFetchData(`${BASE_URL}/product/category?categories=${category}`)
    const filterProductsWithBrand = products.filter(pro=>pro.manuFacture.name === 'Apple');
    console.log(filterProductsWithBrand)
    
     // Lấy giá trị tham số 'category'
    return (

    
        <div>
            <h1>Sản phẩm thuộc danh mục: {category}</h1>
            {/* Logic hiển thị sản phẩm theo category */}
        </div>
    
    );
}

export default Products;

import useFetchData from "../../../../client/src/Hook/userFecthData";
import { BASE_URL } from "../../../config";
import Loader from '../../components/Loader/Loading.jsx';
import Error from '../../components/Error/Error.jsx';
import ProductCard from "./ProductCard";



const ProductList = () => {
    const {data:products,loading,error} = useFetchData(`${BASE_URL}/product`);
    
    return (
        <>
            {loading && <Loader />}
            {error && <Error /> }
            {
                !error && !loading &&(
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {
                            products?.map((product)=>(
                                <ProductCard key={product._id} products={product} />
                            ))
                        }
                    </div>
                )
            }
            
        </>
    );
}

export default ProductList;

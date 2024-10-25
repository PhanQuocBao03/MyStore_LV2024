/* eslint-disable react/prop-types */
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";
  import useFetchData from "../../Hook/userFecthData";
  import { BASE_URL, token } from "../../../config";
  import { toast } from "react-toastify";
  import closeIcon from "../../assets/images/close.png"
  
  const ProductDeleteDialog = ({ open, handleClose, productId }) => {
    const { data:product, loading, error } = useFetchData(productId ?`${BASE_URL}/product/${productId}`:null);
    const DeleteProfileHandle = async e =>{
      e.preventDefault();
      try {
          const res = await fetch(`${BASE_URL}/product/${productId}`,{
              method: 'delete',
              headers:{
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
              
          })
          const result = await res.json();
          handleClose();
          toast.success(result.message);
          // navigate('/products/profile/me')
  
          if(!res.ok){
              throw  Error(result.message)
          }
      } catch (error) {
          toast.error(error.message);
          // setLoading(false);
  
  
          
      }
  };
  
    return (
      <Dialog
        size="lg"
        open={open}
        handler={handleClose}
        
        className=" fixed inset-0 flex justify-center items-center bg-black z-50  bg-opacity-100"
      >
        <div  className='relative w-full max-w-lg bg-white border border-gray-300 shadow-2xl rounded-lg'>
        <DialogHeader className="  text-white justify-center text-[16px] rounded-t-lg bg-blue-400">
          <span>
  
              Xóa Sản phẩm
          </span>
          <div className=" absolute top-2 right-2">
                          <img src={closeIcon} onClick={handleClose} className='w-5 h-5' alt="" />
                          
                      </div>
        </DialogHeader>
        <DialogBody className="p-4">
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {product && (
              <div>
                  <p>Bạn có muốn xóa sản phẩm <span className="text-[18px] font-semibold text-primaryColor">{product.name}</span>?</p>
              </div>
          )}
            
        </DialogBody>
        <DialogFooter className="bg-gray-100 justify-end">
          <div className="mt-7 mr-3">
              <button type="submit" onClick={DeleteProfileHandle} className="bg-red-500 text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg">Xóa</button>
          </div>
          
          
        </DialogFooter>
        </div>
      </Dialog>
    );
  };
  
  export default ProductDeleteDialog;
  
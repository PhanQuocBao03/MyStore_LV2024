import { useEffect, useState } from "react";
import { BASE_URL } from "../../../config";
import useFetchData from "../../Hook/userFecthData";
import { FaPlus, FaSearch } from "react-icons/fa";
import filterIcon from "../../assets/images/filterIcon.png";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import WarrantiesAddDialog from "./warrantiesAddDialog";
import WarrantiesTable from "./warrantiesTable";



const Warranty = () => {
    const [query, setQuery] = useState('');
    const [debounceQuery, setDebounceQuery] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    const { data:warranties, loading, error } = useFetchData(
        `${BASE_URL}/warranty?query=${debounceQuery}`
    );
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceQuery(query);
        }, 900);
        return () => clearTimeout(timeout);
    }, [query]);

    const handleOpen = ()=>{
        setOpenDialog(true);
    }
    const handleClose = ()=>{
        setOpenDialog(false);
    }
    return (
        <>
        <section className="py-0 px-5 pt-4 flex justify-between">
        <div className="text-left flex gap-4 relative group">
                    <h2 className="heading">Quản lý bảo hành</h2>
                    <div className="m-auto flex">
                        <button
                            className="border border-solid rounded-full text-white text-[12px] bg-black text-center p-1"
                            // aria-label="Thêm đơn hàng"
                            onClick={handleOpen}
                        >
                            <FaPlus />
                        </button>
                        <div
                            className={`absolute left-full rounded-md py-1 ml-1 w-20 flex justify-center 
                            bg-indigo-100 text-indigo-800 text-sm z-10 invisible group-hover:visible
                            group-hover:opacity-100 group-hover:translate-x-0
                            `}
                        >
                            <p>Thêm</p>
                        </div>
                    </div>
                </div>
            <div className="w-1/3 justify-end flex">
                    <div className="relative w-full max-w-lg">
                        <input
                            type="search"
                            placeholder="Tìm kiếm..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="w-full p-2 pl-10 border rounded-xl border-gray-300 focus:outline-none"
                        />
                        <button className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                            <FaSearch />
                        </button>
                    </div>
                    <div className="pt-3 text-slate-500 px-5">
                        <img src={filterIcon} className="w-6 h-6" alt="Filter" />
                    </div>
                </div>

        </section>
        <section className="p-0">
                <div className="mt-1">
                    {loading && <Loading />}
                    {error && <Error message="Có lỗi xảy ra khi lấy dữ liệu sản phẩm" />}
                    {!loading && !error && (
                        <div>
                            {warranties.length > 0 ? (
                                <WarrantiesTable warranties={warranties} />
                            ) : (
                                <p className="text-center text-gray-500">Không có sản phẩm nào được tìm thấy.</p>
                            )}
                        </div>
                    )}
                </div>
            </section>
            <WarrantiesAddDialog
                open={openDialog}
                handleClose={handleClose}
                size='lg'
                position='center'
                animate={{
                    mount: { x: 1, y: 0 },
                    unmount: { x: 0.9, y: -100 }
                }}

            
            />
            
        </>
    );
}

export default Warranty;

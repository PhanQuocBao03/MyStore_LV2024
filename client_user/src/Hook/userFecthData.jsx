import { useEffect, useState } from "react";

const useFetchData = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');

                const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) {
                    const result = await res.json();
                    throw new Error(result.message || 'Có lỗi xảy ra');
                }

                const result = await res.json();
                

                setData(result.data);
                setError(null);
            } catch (error) {
                setError(error.message || 'Lỗi không xác định');
                // console.log('Lỗi Fetch:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useFetchData;

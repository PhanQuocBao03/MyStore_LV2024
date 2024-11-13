/* eslint-disable react-refresh/only-export-components */
const FormatDay = (date, config) => {
    const defaultOptions = { day: "numeric", month: "2-digit", year: "numeric" };
    const options = config ? config : defaultOptions;
    return new Date(date).toLocaleDateString('vi-VN', options);
};

const FormatTime = (date, config) => {
    const defaultOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
    const options = config ? config : defaultOptions;
    return new Date(date).toLocaleTimeString('vi-VN', options);
};

// Xuất cả hai hàm
export { FormatDay, FormatTime };

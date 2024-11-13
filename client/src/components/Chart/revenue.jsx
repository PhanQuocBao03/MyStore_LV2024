/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useEffect, useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { getWeek } from 'date-fns'; // Thêm date-fns để tính tuần trong năm

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Revenue = ({ retails, orders }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Doanh thu Online (triệu VND)",
                data: [],
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
                type: "bar",  // Đặt loại dữ liệu là Bar (cột)
            },
            {
                label: "Doanh thu Quầy (triệu VND)",
                data: [],
                backgroundColor: "rgba(153,102,255,0.4)",
                borderColor: "rgba(153,102,255,1)",
                borderWidth: 1,
                type: "bar",  // Đặt loại dữ liệu là Bar (cột)
            },
            {
                label: "Doanh thu Tổng (triệu VND)",
                data: [],
                backgroundColor: "rgba(255,159,64,0.4)",  // Màu cho biểu đồ đường
                borderColor: "rgba(255,159,64,1)",  // Màu cho biểu đồ đường
                borderWidth: 2,
                fill: false,  // Không tô màu dưới đường
                type: "line",  // Đặt loại dữ liệu là Line (đường)
            }
        ],
    });

    const [timeUnit, setTimeUnit] = useState('month'); // Mặc định là theo tháng

    // Hàm lấy nhãn theo tuần
    const getWeekLabel = (date) => getWeek(date); // Sử dụng date-fns để lấy tuần trong năm

    // Hàm lấy nhãn theo tháng
    const getMonthLabel = (date) => date.getMonth(); // Lấy tháng (0-11)
    

    // Hàm lấy nhãn theo quý
    const getQuarterLabel = (date) => {
        const month = date.getMonth();
        return Math.floor(month / 3); // Chuyển tháng thành quý (1-4)
    };

    // const getYearLabel = (date) => date.getFullYear()

    // Sử dụng useMemo để tính toán labelsByTimeUnit và tránh tạo lại mỗi lần render
    const labelsByTimeUnit = useMemo(() => ({
        day: (startDate, endDate) => {
            const labels = [];
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                labels.push(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1); // Tăng ngày
            }
            return labels;
        },
        week: Array.from({ length: 52 }, (_, index) => `Tuần ${index + 1}`),
        month: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", 
                "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
        quarter: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
        year: [], // Sẽ được tính trong useEffect
    }), []); // Chỉ tạo một lần khi component được mount

    const groupByTime = (data, revenueByTime, getLabel, startDate, endDate) => {
        data.forEach((item) => {
            const date = new Date(item.createdAt); // Chuyển createdAt thành Date
            console.log("Raw createdAt:", item.createdAt); // Debug log giá trị createdAt
            console.log("Converted Date:", date); // Debug log đối tượng Date
    
            // Kiểm tra xem ngày có hợp lệ không
            if (isNaN(date)) {
                console.error("Invalid date:", item.createdAt); // Nếu ngày không hợp lệ
                return; // Dừng lại nếu ngày không hợp lệ
            }
    
            const label = getLabel(date); // Lấy nhãn theo đơn vị thời gian (năm trong trường hợp này)
            console.log("Label (Year):", label); // Debug log nhãn (năm)
    
            // Kiểm tra xem label có phải là năm hợp lệ không
            if (label === undefined || isNaN(label)) {
                console.error("Invalid label:", label);
                return; // Dừng lại nếu nhãn không hợp lệ
            }
    
            // Khởi tạo revenueByTime[label] nếu chưa có và cộng doanh thu vào
            revenueByTime[label] = revenueByTime[label] || 0; // Nếu chưa có, khởi tạo với 0
            revenueByTime[label] += item.totalAmount / 1_000_000; // Cộng doanh thu vào label
    
            console.log("Updated revenueByTime:", revenueByTime); // Debug log sau khi cập nhật doanh thu
        });
    };
    
    // Hàm lấy năm từ đối tượng Date
    const getYearLabel = (date) => {
        const year = date.getFullYear();
        console.log("Year from getYearLabel:", year); // Debug log năm
        return year;
    };
    

    // Cập nhật biểu đồ khi thay đổi đơn vị thời gian hoặc dữ liệu
    useEffect(() => {
        const startDate = new Date('2020-01-01'); // Ngày bắt đầu (có thể tùy chỉnh)
        const endDate = new Date(); // Ngày hiện tại

        let revenueByTimeOrders, revenueByTimeRetails, labels;
        let allYears = new Set(); // Dùng Set để lưu các năm duy nhất

        switch (timeUnit) {
            case 'week':
                labels = labelsByTimeUnit.week;
                revenueByTimeOrders = Array(52).fill(0);
                revenueByTimeRetails = Array(52).fill(0);
                break;
            case 'month':
                labels = labelsByTimeUnit.month;
                revenueByTimeOrders = Array(12).fill(0);
                revenueByTimeRetails = Array(12).fill(0);
                break;
            case 'quarter':
                labels = labelsByTimeUnit.quarter;
                revenueByTimeOrders = Array(4).fill(0);
                revenueByTimeRetails = Array(4).fill(0);
                break;
            case 'year':
                // Lấy tất cả các năm từ dữ liệu orders và retails
                orders.forEach((order) => {
                    const year = new Date(order.createdAt).getFullYear();
                    allYears.add(year); // Thêm năm vào Set
                });
                retails.forEach((retail) => {
                    const year = new Date(retail.createdAt).getFullYear();
                    allYears.add(year); // Thêm năm vào Set
                });
                labels = Array.from(allYears).sort(); // Chuyển Set thành mảng và sắp xếp theo thứ tự năm
                revenueByTimeOrders = Array(labels.length).fill(0);
                revenueByTimeRetails = Array(labels.length).fill(0);
                break;
            default:
                labels = labelsByTimeUnit.month;
                revenueByTimeOrders = Array(12).fill(0);
                revenueByTimeRetails = Array(12).fill(0);
                break;
        }

        // Sử dụng getLabel tương ứng với đơn vị thời gian
        const getLabel = timeUnit === 'week' ? getWeekLabel :
                        timeUnit === 'month' ? getMonthLabel :
                        timeUnit === 'year' ? getYearLabel : getQuarterLabel ;

        groupByTime(orders, revenueByTimeOrders, getLabel, startDate, endDate);
        groupByTime(retails, revenueByTimeRetails, getLabel, startDate, endDate);
        console.log(groupByTime(orders, revenueByTimeOrders, getLabel, startDate, endDate))

        const totalRevenueByTime = revenueByTimeOrders.map((order, index) => order + revenueByTimeRetails[index]);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Doanh thu Online (triệu VND)",
                    data: revenueByTimeOrders,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderWidth: 1,
                    type: "bar",
                },
                {
                    label: "Doanh thu Quầy (triệu VND)",
                    data: revenueByTimeRetails,
                    backgroundColor: "rgba(153,102,255,0.4)",
                    borderColor: "rgba(153,102,255,1)",
                    borderWidth: 1,
                    type: "bar",
                },
                {
                    label: "Doanh thu Tổng (triệu VND)",
                    data: totalRevenueByTime,
                    backgroundColor: "rgba(255,159,64,0.4)",
                    borderColor: "rgba(255,159,64,1)",
                    borderWidth: 2,
                    fill: false,
                    type: "line",
                }
            ],
        });
    }, [orders, retails, timeUnit, labelsByTimeUnit]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            title: {
                display: true,
                text: "Biểu đồ Doanh Thu Theo Thời Gian",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Doanh thu (triệu VND)",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Thời gian",
                },
            },
        },
    };

    return (
        <div>
            <div>
                <label>Chọn đơn vị thời gian: </label>
                <select onChange={(e) => setTimeUnit(e.target.value)} value={timeUnit}>
                    <option value="week">Tuần</option>
                    <option value="month">Tháng</option>
                    <option value="quarter">Quý</option>
                    <option value="year">Năm</option>
                </select>
            </div>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default Revenue;

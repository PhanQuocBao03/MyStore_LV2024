import { createContext, useEffect, useReducer } from "react";

const initialState = {
    user: JSON.parse(localStorage.getItem('user') || 'null') || null,
    role: localStorage.getItem('role') || null,
    token: localStorage.getItem('token') || null,
    status: localStorage.getItem('status') || 'off', // Thêm trạng thái ban đầu là "off"
};

// eslint-disable-next-line react-refresh/only-export-components
export const authContext = createContext(initialState);

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                user: null,
                role: null,
                token: null,
                status: 'off',
            };
        case 'LOGIN_SUCCESS':
            return {
                user: action.payload.user,
                role: action.payload.role,
                token: action.payload.token,
                status: 'on', // Đặt trạng thái là "on" khi đăng nhập thành công
            };
        case 'LOGOUT':
            return {
                user: null,
                role: null,
                token: null,
                status: 'off', // Trạng thái là "off" khi đăng xuất
            };
        default:
            return state;
    }
};

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user));
    }, [state.user]);

    useEffect(() => {
        localStorage.setItem("role", state.role);
    }, [state.role]);

    useEffect(() => {
        localStorage.setItem("token", state.token);
    }, [state.token]);

    useEffect(() => {
        localStorage.setItem("status", state.status);
    }, [state.status]);

    return (
        <authContext.Provider value={{ 
            user: state.user, 
            role: state.role, 
            token: state.token, 
            status: state.status, 
            dispatch 
        }}>
            {children}
        </authContext.Provider>
    );
};

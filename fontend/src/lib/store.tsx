import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/lib/features/cart/cartSlice";

// Hàm lấy dữ liệu từ localStorage, xử lý lỗi nếu có
const loadState = (): CartState => {
    try {
        if (typeof window !== "undefined") {
            const savedState = localStorage.getItem("cart");
            return savedState ? JSON.parse(savedState) : { cartItems: [] }; // ✅ Trả về object mặc định nếu không có dữ liệu
        }
    } catch (error) {
        console.error("Failed to load cart state:", error);
    }
    return { cartItems: [] }; // ✅ Trả về giá trị mặc định để tránh lỗi undefined
};

// Cấu hình Redux store
export const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
    preloadedState: typeof window !== "undefined" ? { cart: loadState() } : undefined,
});

// Lưu giỏ hàng vào localStorage mỗi khi Redux state thay đổi
if (typeof window !== "undefined") {
    store.subscribe(() => {
        try {
            localStorage.setItem("cart", JSON.stringify(store.getState().cart));
        } catch (error) {
            console.error("Failed to save cart state:", error);
        }
    });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

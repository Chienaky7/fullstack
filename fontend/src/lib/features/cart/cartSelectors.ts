"use client"
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

// Lấy tổng số lượng sản phẩm trong giỏ hàng
export const selectTotalQuantity = createSelector(
    (state: RootState) => state.cart.cartItems,
    (cartItems) => cartItems.reduce((sum, item) => sum + item.quantity, 0)
);

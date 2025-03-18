'use client'
import StoreNavigation from '@/components/Store_Navigation';
import { Provider } from "react-redux";
import { store } from "@/lib/store";

export default function Layout({ children }: { readonly children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <StoreNavigation />
            <main className="flex-1 overflow-auto p-6 bg-white dark:bg-[#0F0F12]">{children}</main>
        </Provider>
    );
}
'use client'
import { usePublicFetch } from '@/lib/getData';
import Product from "@/components/Poduct";

export default function Product_Lists() {
    const { data: categories, error: errorCategories } = usePublicFetch<{ result: ICategory[] }>('/category');

    if (!categories) return <div>Loading...</div>;
    if (errorCategories) return <div>Error loading categories</div>;


    return (
        <div className="bg-white dark:bg-[#0F0F12] ">
            {
                categories?.result.map((category) => (
                    <div key={category.id} className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-gray-300">{category.name}</h2>
                        <Product categoryId={category.id} />
                    </div>
                ))
            }
        </div>
    )
}

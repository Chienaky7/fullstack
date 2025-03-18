'use client'
import { usePublicFetch } from '@/lib/getData';
import Link from 'next/link';
import Image from "next/image"
import { formatCurrency } from "@/utils/formatCurrency.client";
interface CategoryProp {
    readonly categoryId: string;
}

export default function Product({ categoryId }: CategoryProp) {

    const { data: products, error } = usePublicFetch<{ result: IProduct[] }>(`/product/category/${categoryId}`);

    if (error) return <div >Error loading products</div>;
    if (!products) return <div>Loading...</div>;

    if (!products.result.length) return <div>Không có sản phẩm nào</div>;


    return (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.result.map((product) => (
                <div key={product.id} className="group relative">
                    <Image
                        alt={product?.images[0]?.name}
                        src={`${process.env.NEXT_PUBLIC_API_URL}/image/${product?.images[0]?.name}`}
                        className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                        width={400}
                        height={400}
                        loading="lazy"
                    />
                    <div className="mt-4 flex justify-between">
                        <div>
                            <h3 className="text-sm text-gray-700 dark:text-gray-300">
                                <Link href={product.id}>
                                    <span aria-hidden="true" className="absolute inset-0" />
                                    {product?.name.toString()}
                                </Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{product.name}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{formatCurrency(product.price)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

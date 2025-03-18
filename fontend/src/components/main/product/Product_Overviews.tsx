"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProductGallery from "./product-gallery"
import ProductInfo from "./product-info"
import ProductTabs from "./product-tabs"
import RelatedProducts from "./related-products"
import ProductGuarantee from "./product-guarantee"
import { usePublicFetch } from '@/lib/getData'

const relatedProducts = [
    {
        name: "Tailored Wool Blazer",
        price: "$189.00",
        image: "/placeholder.svg?height=300&width=300"
    },
    {
        name: "Cashmere Blend Sweater",
        price: "$129.00",
        image: "/placeholder.svg?height=300&width=300"
    },
    {
        name: "Slim Fit Chino Pants",
        price: "$89.00",
        image: "/placeholder.svg?height=300&width=300"
    },
]
interface Prop {
    readonly productId: string;
}
export default function ProductPage({ productId }: Prop) {
    const { data: dataProduct, error: errorProduct } = usePublicFetch<{ result: IProduct }>(`/product/${productId}`);
    const [product, setProduct] = useState<IProduct>();

    useEffect(() => {
        if (dataProduct?.result) {
            setProduct(dataProduct.result)
        }
    }, [dataProduct])

    if (errorProduct) return <div>Error loading products</div>;
    if (!product) return <div>Loading...</div>;
    if (!dataProduct) return <div>Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
            {/* Breadcrumb - Hidden on smallest screens */}
            <div className="mb-4 md:mb-8 text-sm text-muted-foreground hidden sm:block">
                <Link href="/" className="hover:text-primary">
                    Home
                </Link>{" "}
                /
                <Link href="/collections" className="mx-2 hover:text-primary">
                    Collections
                </Link>{" "}
                /
                <Link href="/collections/essentials" className="hover:text-primary">
                    Essentials
                </Link>
            </div>

            {/* Product name visible on mobile only */}
            <h1 className="text-2xl font-bold mb-4 sm:hidden">{product.name}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
                {/* Product Images */}
                <ProductGallery images={product.images} isNewArrival={isNewArrival(product.publishDate)} />

                {/* Product Info */}
                <ProductInfo product={product} />
            </div>

            {/* Product Details Tabs */}
            <div className="mt-10 md:mt-16">
                <ProductTabs product={product} />
            </div>

            {/* Related Products */}
            <div className="mt-16 md:mt-24">
                <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">You May Also Like</h2>
                <RelatedProducts products={relatedProducts} />
            </div>

            {/* Product Guarantee */}
            <div className="mt-16 md:mt-24 mb-8 md:mb-12">
                <ProductGuarantee />
            </div>
        </div>
    )
}
function isNewArrival(publishDate: string): boolean {
    const publish = new Date(publishDate);
    const today = new Date();

    // Tính số ngày giữa publishDate và hôm nay
    const diffTime = today.getTime() - publish.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24); // Chuyển milliseconds thành ngày

    return diffDays < 30;
}


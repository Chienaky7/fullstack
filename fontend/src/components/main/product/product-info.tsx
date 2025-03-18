"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckIcon, MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { addToCart } from "@/lib/features/cart/cartSlice";
import { useDispatch } from "react-redux";
import { formatCurrency } from "@/utils/formatCurrency.client";
interface ProductInfoProps {
    product: {
        id: string
        name: string
        price: number
        salePrice?: number
        stock: number
        images: Image[]
        variants?: ProductVariant[]
    }
}

export default function ProductInfo({ product }: Readonly<ProductInfoProps>) {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState("")

    const handleAddToCart = () => {
        dispatch(addToCart({ id: product.id, name: product.name, price: product.price, quantity, image: product.images[0].name }));
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Product name hidden on mobile (shown in parent) */}
            <div className="hidden sm:block">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-2xl md:text-3xl font-bold">{formatCurrency(product.price)}</p>
                    {product.salePrice && (
                        <p className="text-sm text-muted-foreground mt-1">
                            <span className="line-through">{product.salePrice.toFixed(2)}</span>
                            <span className="ml-2 text-green-600 font-medium">
                                Save {Math.round((1 - product.salePrice / product.price) * 100)} %
                            </span>
                        </p>
                    )}
                </div>
                {product.stock > 0 && (
                    <div className="bg-green-50 dark:bg-green-950/30 px-3 py-1 rounded-full">
                        <p className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center">
                            <CheckIcon className="h-4 w-4 mr-1" />
                            In Stock
                        </p>
                    </div>
                )}
            </div>

            <Separator />

            {/* Size Selection */}
            <div>
                <div className="flex justify-between items-center mb-2 md:mb-3">
                    <h3 className="font-medium">Size: {selectedSize}</h3>
                    <Link href="#" className="text-sm text-primary hover:underline">
                        Size Guide
                    </Link>
                </div>
                <div className="grid grid-cols-5 gap-2">
                    {product.variants?.map((variant) => (
                        <button
                            key={variant.price}
                            onClick={() => setSelectedSize(variant.type as string)}
                            className={`h-9 md:h-10 rounded-md border font-medium ${selectedSize === variant.type
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                                }`}
                        >
                            {variant.type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center space-x-2">
                <h3 className="font-medium">Quantity:</h3>
                <div className="flex items-center border rounded-md">
                    <button
                        className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                    >
                        <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button
                        className="p-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setQuantity((q) => q + 1)}
                        aria-label="Increase quantity"
                    >
                        <PlusIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <Separator />

            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
                <Button size="lg" className="w-full" onClick={handleAddToCart}>
                    <ShoppingCartIcon className="mr-2 h-5 w-5" />
                    Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="w-full">
                    Buy Now
                </Button>
            </div>
        </div>
    )
}


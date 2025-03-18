"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePublicFetch } from "@/lib/getData"
import { privateApi } from "@/lib/configAxios"

export function ProductList() {
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [products, setProducts] = useState<IProduct[]>([]);
    const { data: productData, error: productError } = usePublicFetch<{ result: IProduct[] }>(
        selectedCategory ? `/category/${selectedCategory}` : `/product`,
    )
    const { data: categoryData } = usePublicFetch<{ result: ICategory[] }>("/category")

    const handleCategoryChange = (category: string) => {
        if (category === "all") {
            setSelectedCategory("")
            return
        }
        setSelectedCategory(category)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await privateApi.delete(`/product/${id}`)
                setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
            } catch (error) {
                console.error("Failed to delete product:", error)
            }
        }
    }
    useEffect(() => {
        if (productData?.result) {
            setProducts(productData.result);
        }
    }, [productData]);

    if (productError) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-4">Error loading products</h2>
                <p className="text-muted-foreground">{productError.message}</p>
            </div>
        )
    }

    if (!productData) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Products</h2>
                <Select onValueChange={handleCategoryChange} value={selectedCategory}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categoryData?.result.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-4">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                        {selectedCategory
                            ? `No products found in the selected category.`
                            : "No products available. Start by adding your first product!"}
                    </p>
                    <Link href="/admin/products/add-product">
                        <Button>Add Product</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-6 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                            <div className="aspect-video relative">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/image/${product.images[0].name}`}
                                        alt={product.name}
                                        width={210}
                                        height={210}
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                        <p className="text-muted-foreground">No image</p>
                                    </div>
                                )}
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                                        <CardDescription className="line-clamp-1">{product.category.name}</CardDescription>
                                    </div>
                                    <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold mb-2">${product.price.toFixed(2)}</p>
                                <p className="text-muted-foreground line-clamp-2">{product.description}</p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Link href={`/admin/products/edit-product/${product.id}`}>
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}


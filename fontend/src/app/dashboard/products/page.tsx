"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Plus } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { ProductForm } from "@/components/dashboard/products/product-form"
import { DeleteProductDialog } from "@/components/dashboard/products/delete-product-dialog"
import { getProductColumns } from "@/components/dashboard/products/product-columns"
import { usePublicFetch } from "@/lib/getData"
import { postData, putData, delData } from "@/lib/configAxios"
import { toast } from "sonner"

interface ProductPage {
    content: IProduct[];
    totalPages: number;
    last: boolean;

}

export default function ProductsPage() {
    const [pageIndex, setPageIndex] = useState(0)
    const [products, setProducts] = useState<IProduct[]>([]);
    const [pageSize, setPageSize] = useState(5)
    const [searchTerm, setSearchTerm] = useState("");
    const [search, setSearch] = useState(true)
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: productData, error: productError } = usePublicFetch<{ result: ProductPage }>(
        search && !searchTerm.trim()
            ? `product/items?page=${pageIndex}&size=${pageSize}&sortBy=createdAt&direction=desc`
            : `product/search?page=${pageIndex}&size=${pageSize}&sortBy=createdAt&direction=desc&keyword=${searchTerm.trim()}`
    );

    const [categories, setCategories] = useState<ICategory[]>([]);
    const { data: categoryData } = usePublicFetch<{ result: ICategory[] }>("/category")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null)

    useEffect(() => {
        if (productData?.result) {
            setProducts(productData?.result?.content);
        }
        if (categoryData?.result) {
            setCategories(categoryData.result);
        }

    }, [productData, categoryData]);

    const handleAddProduct = async (productData: Partial<IProduct>) => {
        const defaultProduct = {
            name: "", description: "", price: 0, salePrice: 0, stock: 0,
            sku: "", barcode: "", weight: 0, length: 0, width: 0, height: 0,
            title: "", descriptionSeo: "", keywords: "", status: "draft",
            featured: false, taxable: true, publishDate: new Date().toISOString().split("T")[0],
            images: [], category: [], variants: []
        };

        // Gộp dữ liệu sản phẩm với giá trị mặc định
        const productInfo = { ...defaultProduct, ...productData };

        // Xử lý ảnh
        if (productData.images?.length) {
            const newImages = productData.images.filter(img => img.file instanceof File);
            if (newImages.length) {
                const formData = new FormData();
                newImages.forEach(img => formData.append("images", img.file));
                productInfo.images = await postData("/image/list", formData, true);
            }
        }

        // Gửi sản phẩm lên server
        try {
            const newProduct = await postData("/product", productInfo, false);
            toast.success("Add Product successfully")
            setProducts(prev => [newProduct, ...(prev || [])]);
            setIsAddDialogOpen(false);
        } catch (error) {
            toast.error("Add Product fail " + error)
        }

    };


    const handleEdit = (product: IProduct) => {
        setCurrentProduct(product)
        setIsEditDialogOpen(true)
    }

    const handleUpdateProduct = async (productData: Partial<IProduct>) => {
        if (!currentProduct) return;

        // Xử lý hình ảnh
        const oldImages = currentProduct.images || [];
        const newImages = (productData.images ?? []).filter(img => img.file instanceof File);
        const unusedImages = oldImages.filter(oldImg =>
            !productData.images?.some(newImg => newImg.name === oldImg.name)
        );

        let finalImages = productData.images?.map(img => img.name).filter(name =>
            !unusedImages.some(delImg => delImg.name === name) &&
            !newImages.some(newImg => newImg.name === name)
        ) ?? [];

        // Nếu có thay đổi về ảnh, thực hiện cập nhật
        if (newImages.length > 0 || unusedImages.length > 0) {
            const formData = new FormData();
            unusedImages.forEach(img => formData.append("delImages", img.name));
            newImages.forEach(img => formData.append("images", img.file));

            try {
                const uploadedImages = await putData("/image/list", formData, true);
                finalImages = [...uploadedImages, ...finalImages];
            } catch (error) {
                console.error("Lỗi khi cập nhật ảnh:", error);
                return;
            }
        }

        // Gửi dữ liệu cập nhật sản phẩm
        try {
            const updatedProduct = await putData(`/product/${currentProduct.id}`, {
                ...productData,
                images: finalImages,
            }, false);
            toast.success("Update Product successfully")
            setProducts(prevProducts => prevProducts.map(prod =>
                prod.id === currentProduct.id ? updatedProduct : prod
            ));
            setCurrentProduct(null);
            setIsEditDialogOpen(false);

        } catch (error) {
            toast.error("Update Product fail " + error)
        }


    };

    const handleDelete = (product: IProduct) => {
        setCurrentProduct(product)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteProduct = async () => {
        if (!currentProduct) return
        try {
            if (currentProduct.images.length > 0) {
                const formData = new FormData();
                currentProduct.images.forEach(img => formData.append("delImages", img.name));
                formData.append("images", "")
                try {
                    await delData("/image/list", formData, true);
                } catch (error) {
                    toast.error("Delete Product fail " + error)
                    return;
                }
            }
            await delData(`/product/${currentProduct.id}`, {}, false);
            toast.success("Delete Product successfully")
            const filteredProducts = products.filter((prod) => prod.id !== currentProduct.id)
            setProducts(filteredProducts)
            setCurrentProduct(null)
            setIsDeleteDialogOpen(false)
        } catch (error) {
            toast.error("Delete Product fail " + error)
        }

    }

    const handleDownload = (product: IProduct) => {
        // Create a JSON blob and download it
        const productData = JSON.stringify(product, null, 2)
        const blob = new Blob([productData], { type: "application/json" })
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = `product-${product.id}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const columns = getProductColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onDownload: handleDownload,
    })

    const handleSearch = () => {
        setPageSize(5);
        setPageIndex(0);
        setSearch(false);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
            inputRef.current?.blur();
        }
    }
    if (productError) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-4">Error loading products</h2>
                <p className="text-muted-foreground">{productError.message}</p>


            </div>
        )
    }
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                <Button variant={"default"} onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            <DataTable
                setSearch={setSearch}
                handleKeyDown={handleKeyDown}
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
                handleSearch={handleSearch}
                pageSize={pageSize}
                setPageSize={setPageSize}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                totalPages={productData?.result.totalPages}
                columns={columns} data={products} last={productData?.result.last}
                searchKey="name"
                searchPlaceholder="Search products..."
            />

            {/* Add Product Form */}
            <ProductForm
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSave={handleAddProduct}
                mode="add"
                categories={categories}
            />

            {/* Edit Product Form */}
            <ProductForm
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onSave={handleUpdateProduct}
                initialData={currentProduct || undefined}
                mode="edit"
                categories={categories}
            />

            {/* Delete Product Dialog */}
            <DeleteProductDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onDelete={handleDeleteProduct}
                product={currentProduct}
            />
        </div>
    )
}


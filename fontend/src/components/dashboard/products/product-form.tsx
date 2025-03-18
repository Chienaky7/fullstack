"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Trash, Upload, X, DollarSign, Layers, Info, ImageIcon, Search } from "lucide-react"

interface ProductFormProps {
    readonly isOpen: boolean
    readonly onClose: () => void
    readonly onSave: (product: Partial<IProduct>) => void
    readonly initialData?: IProduct
    readonly mode: "add" | "edit"
    readonly categories: ICategory[]
}

export function ProductForm({ isOpen, onClose, onSave, initialData, mode, categories }: ProductFormProps) {
    const [activeTab, setActiveTab] = useState("general")
    const [formData, setFormData] = useState<Partial<IProduct>>({
        name: "",
        description: "",
        price: 0,
        salePrice: 0,
        stock: 0,
        images: [],
        category: categories[0],
        sku: "",
        barcode: "",
        weight: 0,
        length: 0, width: 0, height: 0,
        variants: [],
        title: "",
        descriptionSeo: "",
        keywords: "",
        status: "draft",
        featured: false,
        taxable: true,
        publishDate: new Date().toISOString().split("T")[0],
    })

    const [variantTypes, setVariantTypes] = useState<string[]>([])
    const [newVariantType, setNewVariantType] = useState("")
    const [newVariantOption, setNewVariantOption] = useState("")
    const [selectedVariantType, setSelectedVariantType] = useState("")

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                publishDate: initialData.publishDate ?? new Date().toISOString().split("T")[0],
                title: initialData.title ?? "",
                descriptionSeo: initialData.descriptionSeo ?? "",
                keywords: initialData.keywords ?? "",
                variants: initialData.variants ?? [],
                length: initialData.length ?? 0,
                width: initialData.width ?? 0,
                height: initialData.height ?? 0,
            });

            // Extract variant types from initialData
            if (initialData.variants && initialData.variants.length > 0) {
                const types = [...new Set(initialData.variants.map((v) => v.type as string))]
                setVariantTypes(types)
                setSelectedVariantType(types[0])
            }
        } else {
            setFormData({
                name: "",
                description: "",
                price: 0,
                salePrice: 0,
                stock: 0,
                images: [],
                category: categories[0],
                sku: "",
                barcode: "",
                weight: 0,
                length: 0, width: 0, height: 0,
                variants: [],
                title: "",
                descriptionSeo: "",
                keywords: "",
                status: "draft",
                featured: false,
                taxable: true,
                publishDate: new Date().toISOString().split("T")[0],
            })
            setVariantTypes([])
            setSelectedVariantType("")
        }
    }, [initialData, isOpen, categories])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
    }

    const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: Number.parseFloat(value) || 0,
        }));
    };


    const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleCategoryChange = (value: string) => {
        const selectedCategory = categories.find((cat) => cat.id === value)
        if (selectedCategory) {
            setFormData((prev) => ({ ...prev, category: selectedCategory }))
        }
    }

    const handleStatusChange = (value: string) => {
        setFormData((prev) => ({ ...prev, status: value }))
    }

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: checked }))
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;

        const files = Array.from(event.target.files);
        const newImages = files.map((file) => ({
            name: file.name,
            preview: URL.createObjectURL(file), // Tạo URL tạm thời để hiển thị ảnh
            file: file,
        }));

        setFormData((prev) => ({
            ...prev,
            images: [...(prev.images || []), ...newImages],
        }));
    };

    const handleAddVariantType = () => {
        if (!newVariantType.trim()) return
        if (variantTypes.includes(newVariantType.trim())) return

        setVariantTypes([...variantTypes, newVariantType.trim()])
        setSelectedVariantType(newVariantType.trim())
        setNewVariantType("")
    }

    const handleAddVariantOption = () => {
        if (!newVariantOption.trim() || !selectedVariantType) return

        // Check if this option already exists for the selected type
        const existingOptions = formData.variants?.filter((v) => v.type === selectedVariantType).map((v) => v.value) || []
        if (existingOptions.includes(newVariantOption.trim())) return

        const newVariant: ProductVariant = {
            type: selectedVariantType,
            value: newVariantOption.trim(),
            price: formData.price ?? 0,
            stock: formData.stock ?? 0,
            sku: `${formData.sku ?? "SKU"}-${selectedVariantType.substring(0, 3)}-${newVariantOption.trim().substring(0, 3)}`.toUpperCase(),
        }

        setFormData((prev) => ({
            ...prev,
            variants: [...(prev.variants || []), newVariant],
        }))

        setNewVariantOption("")
    }

    const handleRemoveVariantType = (type: string) => {
        // Remove the type and all its options
        setVariantTypes(variantTypes.filter((t) => t !== type))
        setFormData((prev) => ({
            ...prev,
            variants: prev.variants?.filter((v) => v.type !== type) || [],
        }))

        if (selectedVariantType === type) {
            setSelectedVariantType(variantTypes.filter((t) => t !== type)[0] || "")
        }
    }

    const handleRemoveVariantOption = (type: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            variants: prev.variants?.filter((v) => !(v.type === type && v.value === value)) || [],
        }))
    }

    const handleUpdateVariant = (index: number, field: string, value: string | number) => {
        setFormData((prev) => {
            const updatedVariants = [...(prev.variants || [])]
            updatedVariants[index] = {
                ...updatedVariants[index],
                [field]: typeof value === "string" ? value : Number(value),
            }
            return { ...prev, variants: updatedVariants }
        })
    }

    const handleSubmit = () => {
        const updatedFormData = {
            ...formData,
            title: formData.title ?? formData.name ?? "",
        };
        onSave(updatedFormData);
    };


    return (
        <Dialog open={isOpen} modal
        >
            <DialogContent className=" max-w-4xl max-h-[90vh] overflow-y-auto" onClose={onClose}>
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add New Product" : "Edit Product"}</DialogTitle>
                    <DialogDescription>
                        {mode === "add" ? "Create a new product with details and variants." : "Update the product details."}
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-5 mb-4">
                        <TabsTrigger value="general" className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            <span>General</span>
                        </TabsTrigger>
                        <TabsTrigger value="images" className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            <span>Images</span>
                        </TabsTrigger>
                        <TabsTrigger value="pricing" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>Pricing</span>
                        </TabsTrigger>
                        <TabsTrigger value="inventory" className="flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            <span>Inventory</span>
                        </TabsTrigger>
                        <TabsTrigger value="seo" className="flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            <span>SEO</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* General Tab */}
                    <TabsContent value="general" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Product Name*</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Product name"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category*</Label>
                                <Select value={formData.category?.id} onValueChange={handleCategoryChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Product description"
                                rows={5}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={handleStatusChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="publishDate">Publish Date</Label>
                                <Input
                                    id="publishDate"
                                    name="publishDate"
                                    type="date"
                                    value={formData.publishDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-8">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="featured"
                                    checked={formData.featured}
                                    onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                                />
                                <Label htmlFor="featured">Featured Product</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="taxable"
                                    checked={formData.taxable}
                                    onCheckedChange={(checked) => handleSwitchChange("taxable", checked)}
                                />
                                <Label htmlFor="taxable">Taxable</Label>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Images Tab */}
                    <TabsContent value="images" className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="images">Product Images</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <Label htmlFor="images" className="cursor-pointer">
                                    <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <Upload className="h-4 w-4" />
                                        <span>Upload Images</span>
                                    </div>
                                </Label>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {formData.images?.length ?? 0} image(s) selected
                                </div>
                            </div>

                            {formData.images && formData.images.length > 0 ? (
                                <div className="grid grid-cols-4 gap-4 mt-4">
                                    {formData.images.map((image, index) => (
                                        <div key={image.name + index} className="relative group">
                                            <img
                                                src={image.preview || `${process.env.NEXT_PUBLIC_API_URL}/image/${image.name}`}
                                                alt={image.name}
                                                className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-700 z-100"
                                            />
                                            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-md flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1"
                                                    onClick={() => {
                                                        const newImages = [...(formData.images || [])]
                                                        newImages.splice(index, 1)
                                                        setFormData((prev) => ({ ...prev, images: newImages }))
                                                    }}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="absolute bottom-2 left-2 right-2 text-xs text-black bg-white dark:bg-black bg-opacity-50 dark:text-white p-1 rounded truncate">
                                                {image.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-8 text-center mt-4">
                                    <ImageIcon className="h-8 w-8 mx-auto text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No images uploaded yet</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        Upload product images to enhance your listing
                                    </p>
                                </div>
                            )}

                        </div>
                    </TabsContent>
                    {/* Pricing Tab */}
                    <TabsContent value="pricing" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Regular Price*</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleNumberInputChange}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="salePrice">Sale Price</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="salePrice"
                                        name="salePrice"
                                        type="number"
                                        value={formData.salePrice}
                                        onChange={handleNumberInputChange}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>

                        {formData.salePrice && formData.salePrice > 0 && formData.price && formData.price > 0 && (
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                                <p className="text-sm text-green-700 dark:text-green-400">
                                    Discount: {((1 - formData.salePrice / formData.price) * 100).toFixed(0)}% off
                                </p>
                            </div>
                        )}

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Variant Pricing</h3>
                                <Badge variant="outline" className="text-xs">
                                    {formData.variants?.length ?? 0} variants
                                </Badge>
                            </div>

                            {formData.variants && formData.variants.length > 0 ? (
                                <div className="border rounded-md overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Variant
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    SKU
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Stock
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                            {formData?.variants?.map((variant, index) => (
                                                <tr key={`${variant.type}-${variant.value}`}>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {variant.type}
                                                            </span>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">{variant.value}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <Input
                                                            value={"image-sku"}
                                                            onChange={(e) => handleUpdateVariant(index, "sku", e.target.value)}
                                                            className="h-8 text-xs"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
                                                            <Input
                                                                type="number"
                                                                value={variant.price}
                                                                onChange={(e) => handleUpdateVariant(index, "price", e.target.value)}
                                                                className="h-8 text-xs pl-7"
                                                                min="0"
                                                                step="0.01"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <Input
                                                            type="number"
                                                            value={variant.stock}
                                                            onChange={(e) => handleUpdateVariant(index, "stock", e.target.value)}
                                                            className="h-8 text-xs"
                                                            min="0"
                                                            step="1"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRemoveVariantOption(variant.type as string, variant.value as string)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Trash className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center p-4 border border-dashed rounded-md">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No variants added yet</p>
                                </div>
                            )}

                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md space-y-4">
                                <h4 className="text-sm font-medium">Add New Variant</h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="variantType">Variant Type</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="variantType"
                                                value={newVariantType}
                                                onChange={(e) => setNewVariantType(e.target.value)}
                                                placeholder="e.g. Size, Color"
                                                className="flex-1"
                                            />
                                            <Button onClick={handleAddVariantType} type="button" size="sm">
                                                Add
                                            </Button>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {variantTypes.map((type) => (
                                                <Badge key={type} variant="secondary" className="flex items-center gap-1">
                                                    {type}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveVariantType(type)}
                                                        className="ml-1 hover:text-red-500"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {variantTypes.length > 0 && (
                                        <div className="space-y-2">
                                            <Label htmlFor="variantOption">Variant Option</Label>
                                            <div className="flex gap-2">
                                                <Select value={selectedVariantType} onValueChange={setSelectedVariantType}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {variantTypes.map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Input
                                                    id="variantOption"
                                                    value={newVariantOption}
                                                    onChange={(e) => setNewVariantOption(e.target.value)}
                                                    placeholder="e.g. Small, Red"
                                                    className="flex-1"
                                                />
                                                <Button onClick={handleAddVariantOption} type="button" size="sm">
                                                    Add
                                                </Button>
                                            </div>

                                            {selectedVariantType && (
                                                <div className="mt-2">
                                                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                                                        Options for {selectedVariantType}:
                                                    </Label>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {formData?.variants
                                                            ?.filter((v) => v.type === selectedVariantType)
                                                            .map((v) => (
                                                                <Badge key={String(v.value)} variant="outline" className="flex items-center gap-1">
                                                                    {v.value}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveVariantOption(v.type as string, v.value as string)}
                                                                        className="ml-1 hover:text-red-500"
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </button>
                                                                </Badge>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Inventory Tab */}
                    <TabsContent value="inventory" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                                <Input id="sku" name="sku" value={formData.sku} onChange={handleInputChange} placeholder="SKU-123" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="barcode">Barcode (ISBN, UPC, GTIN, etc.)</Label>
                                <Input
                                    id="barcode"
                                    name="barcode"
                                    value={formData.barcode}
                                    onChange={handleInputChange}
                                    placeholder="123456789"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="stock">Stock Quantity*</Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleNumberInputChange}
                                placeholder="0"
                                min="0"
                                step="1"
                            />
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Dimensions & Weight</h3>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="length">Length (cm)</Label>
                                    <Input
                                        id="length"
                                        name="length"
                                        type="number"
                                        value={formData?.length}
                                        onChange={handleDimensionChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.1"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="width">Width (cm)</Label>
                                    <Input
                                        id="width"
                                        name="width"
                                        type="number"
                                        value={formData?.width}
                                        onChange={handleDimensionChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.1"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="height">Height (cm)</Label>
                                    <Input
                                        id="height"
                                        name="height"
                                        type="number"
                                        value={formData?.height}
                                        onChange={handleDimensionChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.1"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="weight">Weight (kg)</Label>
                                    <Input
                                        id="weight"
                                        name="weight"
                                        type="number"
                                        value={formData.weight}
                                        onChange={handleNumberInputChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.1"
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* SEO Tab */}
                    <TabsContent value="seo" className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="seo.title">Meta Title</Label>
                            <Input
                                id="seo.title"
                                name="title"
                                value={formData.title}
                                onChange={handleSeoChange}
                                placeholder="SEO title (recommended: 50-60 characters)"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Characters: {formData.title?.length ?? 0}/60
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="seo.description">Meta Description</Label>
                            <Textarea
                                id="seo.description"
                                name="descriptionSeo"
                                value={formData?.descriptionSeo}
                                onChange={handleSeoChange}
                                placeholder="SEO description (recommended: 150-160 characters)"
                                rows={3}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Characters: {formData?.descriptionSeo?.length ?? 0}/160
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="seo.keywords">Keywords</Label>
                            <Input
                                id="seo.keywords"
                                name="keywords"
                                value={formData.keywords}
                                onChange={handleSeoChange}
                                placeholder="Comma-separated keywords"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">Separate keywords with commas</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md mt-4">
                            <h3 className="text-sm font-medium mb-2">SEO Preview</h3>
                            <div className="space-y-1">
                                <p className="text-blue-600 dark:text-blue-400 text-lg truncate">
                                    {formData.title ?? formData.name ?? "Product Title"}
                                </p>
                                <p className="text-green-600 dark:text-green-400 text-sm">
                                    example.com/products/{formData.name?.toLowerCase().replace(/\s+/g, "-") ?? "product-url"}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                                    {formData.descriptionSeo ??
                                        formData.description ??
                                        "Product description will appear here. Make sure to write a compelling description to improve click-through rates."}
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>{mode === "add" ? "Create Product" : "Update Product"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


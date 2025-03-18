"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePublicFetch } from "@/lib/getData"
import { putFormData } from "@/lib/configAxios"

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    price: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
        message: "Price must be a positive number.",
    }),
    stock: z.string().refine((val) => !isNaN(Number.parseInt(val)) && Number.parseInt(val) >= 0, {
        message: "Stock must be a non-negative number.",
    }),
    category: z.string({ required_error: "Please select a category." }),
})

interface EditProductFormProps {
    readonly productId: string
}

export function EditProductForm({ productId }: EditProductFormProps) {
    const router = useRouter()
    const [images, setImages] = useState<File[]>([])
    const [existingImages, setExistingImages] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { data: productData, error: productError } = usePublicFetch<{ result: IProduct }>(productId ? `/product/${productId}` : "")
    const { data: categoryData } = usePublicFetch<{ result: ICategory[] }>("/category")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: "",
            stock: "",
            category: "",
        },
    })

    useEffect(() => {
        if (productData?.result) {
            const product = productData.result
            form.reset({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                stock: product.stock.toString(),
                category: product.category.id,
            })
            setExistingImages(product.images.map((img) => img.name) || [])
        }
    }, [productData, form])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files))
        }
    }

    const removeExistingImage = (imageName: string) => {
        setExistingImages((prev) => prev.filter((img) => img !== imageName))
    }

    const removeNewImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true)

            const formData = new FormData()
            formData.append("name", values.name)
            formData.append("description", values.description)
            formData.append("price", values.price)
            formData.append("stock", values.stock)
            formData.append("category", values.category)

            // Gửi danh sách ảnh cũ còn lại
            existingImages.forEach((image) => {
                formData.append("existingImages", image)
            })

            // Gửi ảnh mới
            images.forEach((image) => {
                formData.append("images", image)
            })

            await putFormData(`/product/${productId}`, formData)
            router.refresh()
        } catch (error) {
            console.error("Error updating product:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (productError) {
        return <div>Error loading product: {productError.message}</div>
    }

    if (!productData) {
        return <div>Loading...</div>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Product name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Product description" className="min-h-32" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input placeholder="0.00" type="number" step="0.01" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="stock" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stock</FormLabel>
                            <FormControl>
                                <Input placeholder="0" type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {categoryData?.result.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="space-y-4">
                    <FormLabel>Product Images</FormLabel>
                    <Input type="file" accept="image/*" multiple onChange={handleImageChange} className="mb-4" />

                    <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        {existingImages.map((image, index) => (
                            <div key={index} className="relative group">
                                <img src={`${process.env.NEXT_PUBLIC_API_URL}/image/${image}`} alt="Existing" className="w-full h-auto" />
                                <button type="button" onClick={() => removeExistingImage(image)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Product"}
                </Button>
            </form>
        </Form>
    )
}

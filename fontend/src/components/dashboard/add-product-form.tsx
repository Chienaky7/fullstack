"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
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
import { privateApi, postData } from "@/lib/configAxios"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    price: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
        message: "Price must be a positive number.",
    }),
    stock: z.string().refine((val) => !isNaN(Number.parseInt(val)) && Number.parseInt(val) >= 0, {
        message: "Stock must be a non-negative number.",
    }),
    category: z.string({
        required_error: "Please select a category.",
    }),
})

export function AddProductForm() {
    const [images, setImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)

            // Create preview URLs
            const newPreviews = filesArray.map((file) => URL.createObjectURL(file))

            setImages((prev) => [...prev, ...filesArray])
            setImagePreviews((prev) => [...prev, ...newPreviews])
        }
    }

    const removeImage = (index: number) => {
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(imagePreviews[index])

        setImages((prev) => prev.filter((_, i) => i !== index))
        setImagePreviews((prev) => prev.filter((_, i) => i !== index))
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

            // Append all images
            images.forEach((image) => {
                formData.append("images", image)
            })

            const response = await postData("/product", formData);
            console.log("Thêm sản phẩm thành công:", response);
            // Clean up image previews
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview))

        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
        } finally {
            setIsSubmitting(false)
        }
    }

    async function onSubmit1(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true)

            const response = await privateApi.post("/category", {
                name: values.name,
                description: values.description,
            });

            console.log("Thêm danh mục thành công:", response);

        } catch (error) {
            console.error("Lỗi khi thêm danh mục:", error);
        }
        finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Product name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Product description" className="min-h-32" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0.00" type="number" step="0.01" min="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0" type="number" min="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
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
                        )}
                    />

                    <div className="space-y-4">
                        <label htmlFor="images" className="text-sm font-medium">
                            Product Images
                        </label>
                        <div className="mt-2">
                            <Input id="images" type="file" accept="image/*" multiple onChange={handleImageChange} className="mb-4" />
                            <p className="text-sm text-muted-foreground">
                                Upload multiple product images. Recommended size: 800x800px.
                            </p>
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-6 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={preview} className="relative group">
                                        <div className="aspect-square relative overflow-hidden rounded-md border">
                                            <Image
                                                src={preview || "/placeholder.svg"}
                                                alt={`Preview ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-80 hover:opacity-100"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Add Product"}
                    </Button>
                </form>
            </Form>
            <h2 className="text-xl font-bold mb-4">Add Product</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit1)} className="space-y-8 max-w-2xl">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Category name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Category description" className="min-h-32" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Add Product"}</Button>
                </form>
            </Form>
        </>
    )
}


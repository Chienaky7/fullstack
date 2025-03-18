"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ColumnDef } from "@tanstack/react-table"
import { Download, Edit, Trash, Star, Tag } from "lucide-react"

interface ProductColumnsProps {
    onEdit: (product: IProduct) => void
    onDelete: (product: IProduct) => void
    onDownload: (product: IProduct) => void
}

export function getProductColumns({ onEdit, onDelete, onDownload }: ProductColumnsProps): ColumnDef<IProduct>[] {
    return [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const product = row.original
                return (
                    <div className="flex items-center gap-2">
                        {product.featured && <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />}
                        <span className="font-medium">{product.name}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => {
                const product = row.original
                const price = Number.parseFloat(row.getValue("price"))
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(price)

                return (
                    <div>
                        {product.salePrice ? (
                            <div className="flex flex-col">
                                <span className="text-red-600 dark:text-red-400 font-medium">
                                    {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    }).format(product.salePrice)}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs line-through">{formatted}</span>
                            </div>
                        ) : (
                            formatted
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: "stock",
            header: "Stock",
            cell: ({ row }) => {
                const stock = Number(row.getValue("stock"))
                return (
                    <div>
                        {(() => {
                            if (stock <= 0) {
                                return <Badge variant="destructive">Out of stock</Badge>
                            } else if (stock < 10) {
                                return (
                                    <Badge variant="outline" className="text-amber-600 border-amber-600">
                                        Low stock: {stock}
                                    </Badge>
                                )
                            } else {
                                return <span>{stock}</span>
                            }
                        })()}
                    </div>
                )
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: { row: any }) => {
                const status = row.getValue("status") as string
                let badgeVariant: "default" | "outline" | "secondary" | "destructive" | null | undefined;
                if (status === "published") {
                    badgeVariant = "default";
                } else if (status === "draft") {
                    badgeVariant = "outline";
                } else {
                    badgeVariant = "secondary";
                }
                return (
                    <Badge variant={badgeVariant}>
                        {status || "draft"}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "category.name",
            header: "Category",
            cell: ({ row }) => {
                const category = row.original.category
                return (
                    <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-gray-500" />
                        <span>{category?.name}</span>
                    </div>
                )
            },
        },
        {
            id: "variants",
            header: "Variants",
            cell: ({ row }) => {
                const variants = row.original.variants || []
                const variantCount = variants.length

                return variantCount > 0 ? (
                    <Badge variant="secondary">{variantCount} variants</Badge>
                ) : (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">None</span>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const product = row.original
                return (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(product)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDownload(product)}>
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]
}


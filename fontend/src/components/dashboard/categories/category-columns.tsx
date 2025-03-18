"use client"

import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash } from "lucide-react"

interface CategoryColumnsProps {
    onEdit: (category: ICategory) => void
    onDelete: (category: ICategory) => void
}

export function getCategoryColumns({ onEdit, onDelete }: CategoryColumnsProps): ColumnDef<ICategory>[] {
    return [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const category = row.original
                return (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(category)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]
}


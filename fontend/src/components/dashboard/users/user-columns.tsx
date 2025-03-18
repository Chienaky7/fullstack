"use client"

import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash } from "lucide-react"
import avatarUser from "../../../../public/images/dashboard/user/user.png"

interface UserColumnsProps {
    onEdit: (user: User) => void
    onDelete: (user: User) => void
}

export function getUserColumns({ onEdit, onDelete }: UserColumnsProps): ColumnDef<User>[] {
    return [
        {
            id: "avatar",
            header: "",
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                            src={user?.avatar?.name ? `${process.env.NEXT_PUBLIC_API_URL}/image/${user.avatar.name}` : avatarUser.src}
                            alt={user.fullName}
                            width={40}
                            height={40}
                            className="object-cover"
                        />
                    </div>
                )
            },
        },
        {
            accessorKey: "username",
            header: "Name",
        },
        {
            accessorKey: "fullName",
            header: "FullName",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "role.name",
            header: "Role",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(user)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]
}


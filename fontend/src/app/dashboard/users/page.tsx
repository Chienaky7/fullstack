"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { UserForm } from "@/components/dashboard/users/user-form"
import { DeleteUserDialog } from "@/components/dashboard/users/delete-user-dialog"
import { getUserColumns } from "@/components/dashboard/users/user-columns"
import { usePrivateFetch } from "@/lib/getData"
import { postData, putData, delData } from "@/lib/configAxios"
import { toast } from "sonner"

interface UserPage {
    content: User[];
    totalPages: number;
    last: boolean;
}
export default function UsersPage() {
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const [searchTerm, setSearchTerm] = useState("");
    const [search, setSearch] = useState(true)
    const [users, setUsers] = useState<User[]>([])
    const [roles, setRoles] = useState<Role[]>([])
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<User | null>(null)

    const { data: userData, error: userError } = usePrivateFetch<{ result: UserPage }>(
        search && !searchTerm.trim()
            ? `users/items?page=${pageIndex}&size=${pageSize}&sortBy=createdAt&direction=desc`
            : `users/search?page=${pageIndex}&size=${pageSize}&sortBy=createdAt&direction=desc&keyword=${searchTerm.trim()}`
    );
    const { data: roleData } = usePrivateFetch<{ result: Role[] }>("role");

    useEffect(() => {
        if (userData?.result) {
            setUsers(userData?.result?.content);
        }
        if (roleData?.result) {
            setRoles(roleData?.result);
        }

    }, [userData, roleData]);

    const handleAddUser = async (userData: Partial<User>) => {
        try {
            let avatarUrl = "";
            if (userData.avatar?.file) {
                try {
                    const formData = new FormData();
                    formData.append("images", userData.avatar.file);
                    formData.append("delImages", "");
                    avatarUrl = await postData("/image", formData, true);
                } catch (error) {
                    console.error("Lỗi upload ảnh:", error);
                    return;
                }
            }

            const userInfo = {
                username: userData.username ?? "",
                password: userData.password ?? "12345678",
                fullName: userData.fullName ?? "",
                email: userData.email ?? "",
                phoneNumber: userData.phoneNumber ?? "",
                address: userData.address ?? "",
                avatar: avatarUrl,
                role: userData.role?.name ?? "USER"
            };

            const newUser = await postData("/users/admin", userInfo, false);
            setUsers(users ? [newUser, ...users] : [newUser]);
            toast.success("Add User successfully")
            setIsAddDialogOpen(false);
        } catch (error) {
            toast.error("Add User fail" + error)
        }
    };


    const handleEdit = (user: User) => {
        setCurrentUser(user)
        setIsEditDialogOpen(true)
    }

    const handleUpdateUser = async (userData: Partial<User>) => {
        if (!currentUser) return;

        let avatarName = currentUser.avatar?.name ?? "";

        if (userData.avatar?.preview && userData.avatar?.file) {
            try {
                const formData = new FormData();
                formData.append("images", userData.avatar.file);
                if (userData.avatar.name) {
                    formData.append("delImages", userData.avatar.name);
                }
                avatarName = await postData("/image", formData, true);
            } catch (error) {
                console.error("Lỗi upload ảnh:", error);
                return;
            }
        }

        try {
            const updatedUser: User = await putData(
                `/users/admin/${currentUser.id}`,
                {
                    ...userData,
                    role: userData.role?.name ?? currentUser.role?.name ?? "",
                    avatar: avatarName,
                },
                false
            );

            setUsers(users.map((u) => (u.id === currentUser.id ? updatedUser : u)));
            toast.success("Update User successfully")
            setCurrentUser(null);
            setIsEditDialogOpen(false);
        } catch (error) {
            toast.error("Update User fail " + error)
        }
    };

    const handleDelete = (user: User) => {
        setCurrentUser(user)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteUser = async () => {
        if (!currentUser) return
        try {
            if (currentUser.avatar.name) {
                try {
                    await delData(`/image${currentUser.avatar.name}`, {}, false);
                } catch (error) {
                    toast.error("Delete Product fail " + error)
                    return;
                }
            }
            await delData(`/users/${currentUser.id}`, {}, false);
            const filteredUsers = users.filter((user) => user.id !== currentUser.id)
            toast.success("Delete User successfully")
            setUsers(filteredUsers)
            setCurrentUser(null)
            setIsDeleteDialogOpen(false)
        } catch (error) {
            toast.error("Delete User fail " + error)
        }

    }

    const columns = getUserColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
    })

    const handleSearch = () => {
        setPageSize(5);
        setPageIndex(0);
        setSearch(false);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }

    if (userError) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-4">Error loading categorys</h2>
                <p className="text-muted-foreground">{userError.message}</p>


            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
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
                totalPages={userData?.result.totalPages}
                columns={columns} data={users} searchKey="fullName" searchPlaceholder="Search users..." />

            {/* Add User Form */}
            <UserForm
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSave={handleAddUser}
                mode="add"
                roles={roles}
            />

            {/* Edit User Form */}
            <UserForm
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onSave={handleUpdateUser}
                initialData={currentUser ?? undefined}
                mode="edit"
                roles={roles}
            />

            {/* Delete User Dialog */}
            <DeleteUserDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onDelete={handleDeleteUser}
                user={currentUser}
            />
        </div>
    )
}


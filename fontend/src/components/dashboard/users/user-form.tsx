"use client"

import type React from "react"

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
import { Upload } from "lucide-react"
import { useState, useEffect } from "react"
import avatarUser from "../../../../public/images/dashboard/user/user.png"

interface UserFormProps {
    isOpen: boolean
    onClose: () => void
    onSave: (user: Partial<User>) => void
    initialData?: User
    mode: "add" | "edit"
    roles: Role[]
}

export function UserForm({ isOpen, onClose, onSave, initialData, mode, roles }: Readonly<UserFormProps>) {
    const [formData, setFormData] = useState<Partial<User>>({
        password: "",
        username: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        address: "",
        avatar: {
            name: "",
            preview: "",
            file: new File([], ""),
        },
        role: roles.length > 0 ? roles[0] : undefined,
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                password: initialData.password ?? "",
                username: initialData.username ?? "",
                fullName: initialData.fullName ?? "",
                email: initialData.email ?? "",
                phoneNumber: initialData.phoneNumber ?? "",
                address: initialData.address ?? "",
                avatar: initialData.avatar ?? {
                    name: "",
                    preview: "",
                    file: new File([], ""),
                },
                role: initialData.role ?? (roles.length > 0 ? roles[0] : undefined),
            })
        }
    }, [initialData, isOpen, roles])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value ?? "" }))
    }

    const handleRoleChange = (value: string) => {
        const selectedRole = roles.find((role) => role.name === value)
        if (selectedRole) {
            setFormData((prev) => ({ ...prev, role: selectedRole }))
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const file = files[0]
        const imageUrl = URL.createObjectURL(file)

        setFormData((prev) => ({
            ...prev,
            avatar: {
                name: file.name,
                preview: imageUrl,
                file: file,
            },
        }))
    }

    return (
        <Dialog open={isOpen} modal>
            <DialogContent className="max-w-2xl" onClose={onClose}>
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add New User" : "Edit User"}</DialogTitle>
                    <DialogDescription>
                        {mode === "add" ? "Create a new user account." : "Update user details."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                                <img
                                    src={formData.avatar?.preview || (formData.avatar?.name ? `${process.env.NEXT_PUBLIC_API_URL}/image/${formData.avatar.name}` : avatarUser.src)}
                                    alt="User avatar"
                                    width={96}
                                    height={96}
                                    className="object-cover"
                                />
                            </div>
                            <Input id="avatar-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            <Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer">
                                <Upload className="h-4 w-4" />
                            </Label>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username*</Label>
                            <Input id="username" name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Password (min 8 characters)" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email address" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Phone number" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={formData.role?.name} onValueChange={handleRoleChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.name} value={role.name}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" value={formData.address ?? ""} onChange={handleInputChange} placeholder="Address" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={() => onSave(formData)}>{mode === "add" ? "Save" : "Update"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

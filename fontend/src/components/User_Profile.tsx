"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Save, X } from "lucide-react"


export default function UserProfileCard() {
    const [user, setUser] = useState<User>()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<User>({} as User)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("user");
            if (userData) {
                setUser(JSON.parse(userData));
            }
        }
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSave = () => {
        setUser(formData)
        setIsEditing(false)
        // In a real app, you would send this data to your backend
        console.log("Saving user data:", formData)
    }

    const handleCancel = () => {
        setFormData(user)
        setIsEditing(false)
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>User Profile</CardTitle>
                    <CardDescription>View and manage your account information</CardDescription>
                </div>
                {!isEditing ? (
                    <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                        </Button>
                        <Button variant="default" size="icon" onClick={handleSave}>
                            <Save className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.avatar.name} alt={user.fullName} />
                        <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 text-center sm:text-left">
                        <h3 className="text-2xl font-semibold">{user.fullName}</h3>
                        <p className="text-muted-foreground">@{user.username}</p>
                    </div>
                </div>

                {isEditing ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" name="username" value={formData.username} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Profile Image URL</Label>
                            <Input id="image" name="image" value={formData.avatar.name} onChange={handleInputChange} />
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right font-medium">Username:</Label>
                            <div className="col-span-3">{user.username}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right font-medium">Email:</Label>
                            <div className="col-span-3">{user.email}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right font-medium">Phone:</Label>
                            <div className="col-span-3">{user.phoneNumber}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right font-medium">Address:</Label>
                            <div className="col-span-3">{user.address}</div>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">User ID: {user.id}</p>
                {isEditing && (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}


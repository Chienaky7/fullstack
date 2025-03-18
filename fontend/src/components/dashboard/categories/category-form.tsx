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
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"

interface CategoryFormProps {
    isOpen: boolean
    onClose: () => void
    onSave: (category: Partial<ICategory>) => void
    initialData?: ICategory
    mode: "add" | "edit"
}

export function CategoryForm({ isOpen, onClose, onSave, initialData, mode }: Readonly<CategoryFormProps>) {
    const [formData, setFormData] = useState<Partial<ICategory>>({
        name: "",
        description: "",
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description,
            })
        } else {
            setFormData({
                name: "",
                description: "",
            })
        }
    }, [initialData, isOpen])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () => {
        onSave(formData)
    }

    return (
        <Dialog
            open={isOpen}
            modal
        >
            <DialogContent onClose={onClose}>
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add New Category" : "Edit Category"}</DialogTitle>
                    <DialogDescription>
                        {mode === "add" ? "Create a new category for your products." : "Update the category details."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Category name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Category description"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>{mode === "add" ? "Save" : "Update"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


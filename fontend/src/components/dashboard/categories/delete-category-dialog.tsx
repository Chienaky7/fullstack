"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface DeleteCategoryDialogProps {
    readonly isOpen: boolean
    readonly onClose: () => void
    readonly onDelete: () => void
    readonly category: ICategory | null
}

export function DeleteCategoryDialog({ isOpen, onClose, onDelete, category }: DeleteCategoryDialogProps) {
    return (
        <Dialog
            open={isOpen}
            modal
        >
            <DialogContent onClose={onClose}>
                <DialogHeader>
                    <DialogTitle>Delete Category</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {category?.name}? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


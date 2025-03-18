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

interface DeleteProductDialogProps {
    readonly isOpen: boolean
    readonly onClose: () => void
    readonly onDelete: () => void
    readonly product: IProduct | null
}

export function DeleteProductDialog({ isOpen, onClose, onDelete, product }: DeleteProductDialogProps) {
    return (
        <Dialog
            open={isOpen}
            modal
        >
            <DialogContent onClose={onClose}>
                <DialogHeader>
                    <DialogTitle>Delete Product</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {product?.name}? This action cannot be undone.
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

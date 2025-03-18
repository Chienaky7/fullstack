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

interface DeleteUserDialogProps {
    isOpen: boolean
    onClose: () => void
    onDelete: () => void
    user: User | null
}

export function DeleteUserDialog({ isOpen, onClose, onDelete, user }: Readonly<DeleteUserDialogProps>) {
    return (
        <Dialog
            open={isOpen}
            modal
        >
            <DialogContent onClose={onClose}>
                <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {user?.fullName}? This action cannot be undone.
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


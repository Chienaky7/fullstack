"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { CategoryForm } from "@/components/dashboard/categories/category-form"
import { DeleteCategoryDialog } from "@/components/dashboard/categories/delete-category-dialog"
import { getCategoryColumns } from "@/components/dashboard/categories/category-columns"
import { usePublicFetch } from "@/lib/getData"
import { postData, putData, delData } from "@/lib/configAxios"
import { toast } from "sonner"

interface CategoryPage {
    content: ICategory[];
    totalPages: number;
    last: boolean;

}
export default function CategoriesPage() {
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const [searchTerm, setSearchTerm] = useState("");
    const [search, setSearch] = useState(true)
    const [categories, setCategories] = useState<ICategory[]>([])
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentCategory, setCurrentCategory] = useState<ICategory | null>(null)

    const { data: categorytData, error: categoryError } = usePublicFetch<{ result: CategoryPage }>(
        search && !searchTerm.trim()
            ? `category/items?page=${pageIndex}&size=${pageSize}&sortBy=createdAt&direction=desc`
            : `category/search?page=${pageIndex}&size=${pageSize}&sortBy=createdAt&direction=desc&keyword=${searchTerm.trim()}`
    );

    useEffect(() => {
        if (categorytData?.result) {
            setCategories(categorytData?.result?.content);
        }

    }, [categorytData]);

    const handleAddCategory = async (categoryData: Partial<ICategory>) => {
        const categoryInfo = {
            name: categoryData.name ?? "",
            description: categoryData.description ?? "",
        }

        try {
            const newCategory = await postData("/category", categoryInfo, false);
            setCategories(categories ? [newCategory, ...categories] : [newCategory]);
            setIsAddDialogOpen(false)
            toast.success("Add Category successfully")
        } catch (error) {
            toast.error("Add Category fail " + error)
        }

    }

    const handleEdit = (category: ICategory) => {
        setCurrentCategory(category)
        setIsEditDialogOpen(true)
    }

    const handleUpdateCategory = async (categoryData: Partial<ICategory>) => {
        if (!currentCategory) return

        let updatedCategories;
        try {
            const updatedCategory = await putData(`/category/${currentCategory.id}`, {
                ...categoryData
            }, false);

            updatedCategories = categories.map((cat: ICategory) =>
                cat.id === currentCategory.id ? updatedCategory : cat
            );
            setCategories(updatedCategories)
            toast.success("Update Category successfully")
            setCurrentCategory(null)
            setIsEditDialogOpen(false)
        } catch (error) {
            toast.error("Update Category fail " + error)
        }

    }

    const handleDelete = (category: ICategory) => {
        setCurrentCategory(category)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteCategory = async () => {
        if (!currentCategory) return
        try {
            await delData(`/category/${currentCategory.id}`, {}, false);
            toast.success("Delete Category successfully")
            const filteredCategories = categories.filter((cat) => cat.id !== currentCategory.id)
            setCategories(filteredCategories)
            setCurrentCategory(null)
            setIsDeleteDialogOpen(false)
        } catch (error) {
            toast.error("Delete Category fail " + error)
        }

    }

    const columns = getCategoryColumns({
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
    if (categoryError) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-4">Error loading categorys</h2>
                <p className="text-muted-foreground">{categoryError.message}</p>


            </div>
        )
    }
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
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
                totalPages={categorytData?.result.totalPages}
                columns={columns} data={categories} searchKey="name" searchPlaceholder="Search categories..." />

            {/* Add Category Form */}
            <CategoryForm
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSave={handleAddCategory}
                mode="add"
            />

            {/* Edit Category Form */}
            <CategoryForm
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onSave={handleUpdateCategory}
                initialData={currentCategory ?? undefined}
                mode="edit"
            />

            {/* Delete Category Dialog */}
            <DeleteCategoryDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onDelete={handleDeleteCategory}
                category={currentCategory}
            />
        </div>
    )
}


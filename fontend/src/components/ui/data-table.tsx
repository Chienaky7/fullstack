"use client"

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    type SortingState,
    getSortedRowModel,
    type ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, Dispatch, SetStateAction } from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string
    searchPlaceholder?: string
    setPageIndex: Dispatch<SetStateAction<number>>
    totalPages?: number
    last?: boolean
    pageIndex: number
    pageSize: number
    setPageSize: Dispatch<SetStateAction<number>>
    searchTerm: string
    handleSearch: () => void;
    setSearchTerm: Dispatch<SetStateAction<string>>
    handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
    setSearch: Dispatch<SetStateAction<boolean>>
}

export function DataTable<TData, TValue>({
    setPageIndex,
    pageSize,
    setPageSize,
    pageIndex,
    totalPages,
    last,
    columns,
    data,
    searchKey,
    searchPlaceholder = "Search...",
    searchTerm,
    handleSearch,
    setSearchTerm,
    handleKeyDown,
    setSearch

}: Readonly<DataTableProps<TData, TValue>>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize, // Set số dòng mặc định
            },
        },
    })

    return (
        <div className="space-y-4">
            {searchKey && (
                <div className="flex items-center relative">
                    <Search className="absolute left-3 h-4 w-4" onClick={handleSearch} />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchTerm ?? ""}
                        onChange={(e) => { setSearch(true); setSearchTerm(e.target.value) }}
                        onKeyDown={handleKeyDown}
                        className="pl-9 max-w-sm border-gray-200 dark:border-[#1F1F23]"
                    />
                </div>
            )}
            <div className="rounded-md border border-gray-200 dark:border-[#1F1F23]">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {data && table?.getRowModel()?.rows?.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns?.length || 1} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {pageIndex + 1} {" "}
                    of {totalPages ?? 0} entries
                </div>
                <div className="flex items-center space-x-4">
                    {/* Dropdown chọn số dòng hiển thị */}
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => {
                            const size = Number(value)
                            setPageSize(size)
                            table.setPageSize(size) // Cập nhật số dòng hiển thị
                        }}
                    >
                        <SelectTrigger className="w-[90px]">
                            <SelectValue placeholder="Rows" />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 50].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size} rows
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Nút phân trang */}
                    <Button variant="outline" size="sm" onClick={() => { setPageIndex(prev => prev - 1); table.previousPage() }} disabled={pageIndex === 0}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setPageIndex(prev => prev + 1); table.nextPage() }} disabled={last}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )

}


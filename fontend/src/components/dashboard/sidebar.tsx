"use client"

import type React from "react"

import {
    BarChart2,
    Receipt,
    Building2,
    CreditCard,
    Folder,
    Wallet,
    Users2,
    MessagesSquare,
    Video,
    Settings,
    HelpCircle,
    Menu,
    ShoppingBag,
    Tags,
    Home,
} from "lucide-react"

import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Sidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    function handleNavigation() {
        setIsMobileMenuOpen(false)
    }

    return (
        <>
            <button
                type="button"
                className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <nav
                className={`
                fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200 dark:border-[#1F1F23]
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
            >
                <div className="h-full flex flex-col">
                    <Link
                        href="/dashboard"
                        className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-[#1F1F23]"
                    >
                        <div className="flex items-center gap-3">
                            <Image
                                src="https://kokonutui.com/logo.svg"
                                alt="Acme"
                                width={32}
                                height={32}
                                className="flex-shrink-0 hidden dark:block"
                            />
                            <Image
                                src="https://kokonutui.com/logo-black.svg"
                                alt="Acme"
                                width={32}
                                height={32}
                                className="flex-shrink-0 block dark:hidden"
                            />
                            <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
                                Dashboard
                            </span>
                        </div>
                    </Link>

                    <div className="flex-1 overflow-y-auto py-4 px-4">
                        <div className="space-y-6">
                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Overview
                                </div>
                                <div className="space-y-1">
                                    <NavItem href="/dashboard" icon={Home} pathname={pathname} handleNavigation={handleNavigation}>
                                        Dashboard
                                    </NavItem>
                                    <NavItem href="/dashboard/analytics" icon={BarChart2} pathname={pathname} handleNavigation={handleNavigation}>
                                        Analytics
                                    </NavItem>
                                    <NavItem href="/dashboard/organization" icon={Building2} pathname={pathname} handleNavigation={handleNavigation}>
                                        Organization
                                    </NavItem>
                                    <NavItem href="/dashboard/projects" icon={Folder} pathname={pathname} handleNavigation={handleNavigation}>
                                        Projects
                                    </NavItem>
                                </div>
                            </div>

                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Finance
                                </div>
                                <div className="space-y-1">
                                    <NavItem href="/dashboard/transactions" icon={Wallet} pathname={pathname} handleNavigation={handleNavigation}>
                                        Transactions
                                    </NavItem>
                                    <NavItem href="/dashboard/invoices" icon={Receipt} pathname={pathname} handleNavigation={handleNavigation}>
                                        Invoices
                                    </NavItem>
                                    <NavItem href="/dashboard/payments" icon={CreditCard} pathname={pathname} handleNavigation={handleNavigation}>
                                        Payments
                                    </NavItem>
                                </div>
                            </div>

                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Management
                                </div>
                                <div className="space-y-1">
                                    <NavItem href="/dashboard/products" icon={ShoppingBag} pathname={pathname} handleNavigation={handleNavigation}>
                                        Products
                                    </NavItem>
                                    <NavItem href="/dashboard/categories" icon={Tags} pathname={pathname} handleNavigation={handleNavigation}>
                                        Categories
                                    </NavItem>
                                    <NavItem href="/dashboard/users" icon={Users2} pathname={pathname} handleNavigation={handleNavigation}>
                                        Users
                                    </NavItem>
                                </div>
                            </div>

                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Team
                                </div>
                                <div className="space-y-1">
                                    <NavItem href="/dashboard/members" icon={Users2} pathname={pathname} handleNavigation={handleNavigation}>
                                        Members
                                    </NavItem>
                                    <NavItem href="/dashboard/chat" icon={MessagesSquare} pathname={pathname} handleNavigation={handleNavigation}>
                                        Chat
                                    </NavItem>
                                    <NavItem href="/dashboard/meetings" icon={Video} pathname={pathname} handleNavigation={handleNavigation}>
                                        Meetings
                                    </NavItem>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
                        <div className="space-y-1">
                            <NavItem href="/dashboard/settings" icon={Settings} pathname={pathname} handleNavigation={handleNavigation}>
                                Settings
                            </NavItem>
                            <NavItem href="/dashboard/help" icon={HelpCircle} pathname={pathname} handleNavigation={handleNavigation}>
                                Help
                            </NavItem>
                        </div>
                    </div>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    )
}

function NavItem({
    href,
    icon: Icon,
    children,
    pathname,
    handleNavigation,
}: {
    readonly href: string
    readonly icon: any
    readonly children: React.ReactNode
    readonly pathname: string
    readonly handleNavigation: () => void
}) {
    const isActive = pathname === href

    return (
        <Link
            href={href}
            onClick={handleNavigation}
            className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors 
        ${isActive
                    ? "bg-gray-100 dark:bg-[#1F1F23] text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
                }`}
        >
            <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
            {children}
        </Link>
    )
}



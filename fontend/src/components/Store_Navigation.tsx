"use client"
import { Fragment, useState, useEffect, useRef } from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@headlessui/react'
import { Button } from "@/components/ui/button"
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Card from '@/components/Carts'
import { privateApi } from '@/lib/configAxios'
import { useSelector } from "react-redux";
import { selectTotalQuantity } from "@/lib/features/cart/cartSelectors";
import { ThemeToggle } from './theme-toggle'
const navigation = {
    categories: [
        {
            id: 'women',
            name: 'Women',
            featured: [
                {
                    name: 'New Arrivals',
                    href: '#',
                    imageSrc: 'https://tailwindui.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg',
                    imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
                },
                {
                    name: 'Basic Tees',
                    href: '#',
                    imageSrc: 'https://tailwindui.com/plus-assets/img/ecommerce-images/mega-menu-category-02.jpg',
                    imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
                },
            ],
            sections: [
                {
                    id: 'clothing',
                    name: 'Clothing',
                    items: [
                        { name: 'Tops', href: '#' },
                        { name: 'Dresses', href: '#' },
                        { name: 'Pants', href: '#' },
                        { name: 'Denim', href: '#' },
                        { name: 'Sweaters', href: '#' },
                        { name: 'T-Shirts', href: '#' },
                        { name: 'Jackets', href: '#' },
                        { name: 'Activewear', href: '#' },
                        { name: 'Browse All', href: '#' },
                    ],
                },
                {
                    id: 'accessories',
                    name: 'Accessories',
                    items: [
                        { name: 'Watches', href: '#' },
                        { name: 'Wallets', href: '#' },
                        { name: 'Bags', href: '#' },
                        { name: 'Sunglasses', href: '#' },
                        { name: 'Hats', href: '#' },
                        { name: 'Belts', href: '#' },
                    ],
                },
                {
                    id: 'brands',
                    name: 'Brands',
                    items: [
                        { name: 'Full Nelson', href: '#' },
                        { name: 'My Way', href: '#' },
                        { name: 'Re-Arranged', href: '#' },
                        { name: 'Counterfeit', href: '#' },
                        { name: 'Significant Other', href: '#' },
                    ],
                },
            ],
        },
        {
            id: 'men',
            name: 'Men',
            featured: [
                {
                    name: 'New Arrivals',
                    href: '#',
                    imageSrc:
                        'https://tailwindui.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg',
                    imageAlt: 'Drawstring top with elastic loop closure and textured interior padding.',
                },
                {
                    name: 'Artwork Tees',
                    href: '#',
                    imageSrc: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-02-image-card-06.jpg',
                    imageAlt:
                        'Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.',
                },
            ],
            sections: [
                {
                    id: 'clothing',
                    name: 'Clothing',
                    items: [
                        { name: 'Tops', href: '#' },
                        { name: 'Pants', href: '#' },
                        { name: 'Sweaters', href: '#' },
                        { name: 'T-Shirts', href: '#' },
                        { name: 'Jackets', href: '#' },
                        { name: 'Activewear', href: '#' },
                        { name: 'Browse All', href: '#' },
                    ],
                },
                {
                    id: 'accessories',
                    name: 'Accessories',
                    items: [
                        { name: 'Watches', href: '#' },
                        { name: 'Wallets', href: '#' },
                        { name: 'Bags', href: '#' },
                        { name: 'Sunglasses', href: '#' },
                        { name: 'Hats', href: '#' },
                        { name: 'Belts', href: '#' },
                    ],
                },
                {
                    id: 'brands',
                    name: 'Brands',
                    items: [
                        { name: 'Re-Arranged', href: '#' },
                        { name: 'Counterfeit', href: '#' },
                        { name: 'Full Nelson', href: '#' },
                        { name: 'My Way', href: '#' },
                    ],
                },
            ],
        },
    ],
    pages: [
        { name: 'Company', href: '#' },
        { name: 'Stores', href: '#' },
    ],
}

export default function Store_Navigation() {
    const totalQuantity = useSelector(selectTotalQuantity);
    const [clientTotalQuantity, setClientTotalQuantity] = useState(0);
    const [showCard, setShowCard] = useState(false);
    const [open, setOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<User | null>(null);


    const handleClickOutside = (event: MouseEvent) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };


    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("user");
            setUser(userData ? JSON.parse(userData) : null);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setClientTotalQuantity(totalQuantity);
    }, [totalQuantity]);

    const handleLogout = () => {
        try {
            privateApi.post("/auth/logout", {
                token: localStorage.getItem("token")
            });
        } catch (error) {

        } finally {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
        }
    }

    return (
        <div className=" bg-white dark:bg-[#0F0F12] sticky w-full top-0 z-50 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 ">
            {/* Mobile menu */}
            <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                />

                <div className="fixed inset-0 z-40 flex">
                    <DialogPanel
                        transition
                        className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
                    >
                        <div className="flex px-4 pt-5 pb-2">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                            >
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon aria-hidden="true" className="size-6" />
                            </button>
                        </div>

                        {/* Links */}
                        <TabGroup className="mt-2">
                            <div className="border-b border-gray-200 dark:border-[#1F1F23]">
                                <TabList className="-mb-px flex space-x-8 px-4">
                                    {navigation.categories.map((category) => (
                                        <Tab
                                            key={category.name}
                                            className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
                                        >
                                            {category.name}
                                        </Tab>
                                    ))}
                                </TabList>
                            </div>
                            <TabPanels as={Fragment}>
                                {navigation.categories.map((category) => (
                                    <TabPanel key={category.name} className="space-y-10 px-4 pt-10 pb-8">
                                        <div className="grid grid-cols-2 gap-x-4">
                                            {category.featured.map((item) => (
                                                <div key={item.name} className="group relative text-sm">
                                                    <img
                                                        alt={item.imageAlt}
                                                        src={item.imageSrc}
                                                        className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                                                    />
                                                    <Link href={item.href} className="mt-6 block font-medium text-gray-900">
                                                        <span aria-hidden="true" className="absolute inset-0 z-10" />
                                                        {item.name}
                                                    </Link>
                                                    <p aria-hidden="true" className="mt-1">
                                                        Shop now
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        {category.sections.map((section) => (
                                            <div key={section.name}>
                                                <p id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-gray-900">
                                                    {section.name}
                                                </p>
                                                <ul
                                                    aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                                                    className="mt-6 flex flex-col space-y-6"
                                                >
                                                    {section.items.map((item) => (
                                                        <li key={item.name} className="flow-root">
                                                            <Link href={item.href} className="-m-2 block p-2 text-gray-500">
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </TabPanel>
                                ))}
                            </TabPanels>
                        </TabGroup>

                        <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                            {navigation.pages.map((page) => (
                                <div key={page.name} className="flow-root">
                                    <Link href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
                                        {page.name}
                                    </Link>
                                </div>
                            ))}
                        </div>


                        <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                            {
                                user ? (
                                    <>
                                        <div className="flow-root">
                                            <Link href="/user" className="-m-2 block p-2 font-medium text-gray-900">
                                                {user?.fullName}
                                            </Link>
                                        </div>
                                        <div className="flow-root">
                                            <Button onClick={handleLogout} className="-m-2 block p-2 font-medium text-gray-900">
                                                Logout
                                            </Button>
                                        </div>
                                    </>

                                ) : (
                                    <>
                                        <div className="flow-root">
                                            <Link href="/login" className="-m-2 block p-2 font-medium text-gray-900">
                                                Sign in
                                            </Link>
                                        </div>
                                        <div className="flow-root">
                                            <Link href="/login" className="-m-2 block p-2 font-medium text-gray-900">
                                                Create account
                                            </Link>
                                        </div>
                                    </>
                                )
                            }

                        </div>

                        <div className="border-t border-gray-200 px-4 py-6">
                            <Link href="#" className="-m-2 flex items-center p-2">
                                <img
                                    alt=""
                                    src="https://tailwindui.com/plus-assets/img/flags/flag-canada.svg"
                                    className="block h-auto w-5 shrink-0"
                                />
                                <span className="ml-3 block text-base font-medium text-gray-900">CAD</span>
                                <span className="sr-only">, change currency</span>
                            </Link>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            <header className="relative bg-white dark:bg-[#0F0F12] z-40">
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
                    <div className="border-b border-gray-200 dark:border-[#1F1F23]">
                        <div className="flex h-16 items-center ">
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="relative rounded-md hover:bg-gray-100 dark:hover:bg-[#1F1F23]  lg:hidden"
                            >
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open menu</span>
                                <Bars3Icon aria-hidden="true" className="size-6  text-gray-600 dark:text-gray-300" />
                            </button>

                            {/* Logo */}
                            <div className="ml-4 flex lg:ml-0">
                                <Link href="/">
                                    <span className="sr-only">Your Company</span>
                                    <img
                                        alt=""
                                        src="https://kokonutui.com/logo.svg"
                                        className="h-8 w-auto"
                                    />
                                </Link>
                            </div>

                            {/* Flyout menus */}
                            <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch ">
                                <div className="flex h-full space-x-8">
                                    {navigation.categories.map((category) => (
                                        <Popover ref={popoverRef} key={category.name} className="flex " >
                                            <div className="relative flex">
                                                <PopoverButton onClick={() => setIsOpen(true)} className="relative z-10 -mb-px flex items-center border-b-2 border-transparent pt-px text-sm font-medium transition-colors duration-200 ease-out text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100  data-open:border-indigo-600 data-open:text-indigo-600">
                                                    {category.name}
                                                </PopoverButton>
                                            </div>
                                            {
                                                isOpen && (<PopoverPanel
                                                    transition
                                                    className="absolute inset-x-0 top-full text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in  "
                                                >
                                                    {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                                    <div aria-hidden="true" className="absolute inset-0 top-1/2 bg-white shadow-sm" />

                                                    <div className="relative bg-white">
                                                        <div className="mx-auto max-w-7xl px-8">
                                                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                                                <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                                                    {category.featured.map((item) => (
                                                                        <div key={item.name} className="group relative text-base sm:text-sm">
                                                                            <img
                                                                                alt={item.imageAlt}
                                                                                src={item.imageSrc}
                                                                                className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                                                                            />
                                                                            <Link href={item.href} className="mt-6 block font-medium text-gray-900">
                                                                                <span aria-hidden="true" className="absolute inset-0 z-10" />
                                                                                {item.name}
                                                                            </Link>
                                                                            <p aria-hidden="true" className="mt-1">
                                                                                Shop now
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                                                    {category.sections.map((section) => (
                                                                        <div key={section.name}>
                                                                            <p id={`${section.name}-heading`} className="font-medium text-gray-900">
                                                                                {section.name}
                                                                            </p>
                                                                            <ul
                                                                                aria-labelledby={`${section.name}-heading`}
                                                                                className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                                                            >
                                                                                {section.items.map((item) => (
                                                                                    <li key={item.name} className="flex">
                                                                                        <Link href={item.href} className="hover:text-gray-800">
                                                                                            {item.name}
                                                                                        </Link>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </PopoverPanel>
                                                )
                                            }

                                        </Popover>
                                    ))}

                                    {navigation.pages.map((page) => (
                                        <Link
                                            key={page.name}
                                            href={page.href}
                                            className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 "
                                        >
                                            {page.name}
                                        </Link>
                                    ))}
                                </div>
                            </PopoverGroup>

                            <div className="ml-auto flex items-center">
                                {
                                    user ? (
                                        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                            <Link href="/user" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 ">
                                                {user.fullName}
                                            </Link>
                                            <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                                            <Button onClick={handleLogout} className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100  bg-white dark:bg-[#0F0F12]">
                                                Logout
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                            <Link href="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 ">
                                                Sign in
                                            </Link>
                                            <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                                            <Link href="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 ">
                                                Create account
                                            </Link>
                                        </div>
                                    )
                                }
                                <div className="hidden lg:ml-8 lg:flex">
                                    <Link href="#" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 ">
                                        <img
                                            alt=""
                                            src="https://tailwindui.com/plus-assets/img/flags/flag-canada.svg"
                                            className="block h-auto w-5 shrink-0"
                                        />
                                        <span className="ml-3 block text-sm font-medium">CAD</span>
                                        <span className="sr-only">, change currency</span>
                                    </Link>
                                </div>

                                {/* Search */}
                                <div className="flex lg:ml-6">
                                    <Link href="#" className="p-2 text-gray-400 hover:text-gray-500">
                                        <span className="sr-only">Search</span>
                                        <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                                    </Link>
                                </div>
                                <ThemeToggle />
                                {/* Cart */}
                                <div className="ml-4 flow-root lg:ml-6 ">
                                    <Button onClick={() => setShowCard(true)} className="group -m-2 flex items-center p-2 z-40">
                                        <ShoppingBagIcon
                                            aria-hidden="true"
                                            className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 ">{clientTotalQuantity}</span>
                                        <span className="sr-only">items in cart, view bag</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <Card open={showCard} setOpen={setShowCard} />
        </div>
    )
}

'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "@/lib/features/cart/cartSlice";
import { RootState } from "@/lib/store";
import { useState, useEffect } from 'react';
import { formatCurrency } from "@/utils/formatCurrency.client";
import Link from 'next/link';
import { Button } from './ui/button';
interface OpenPorp {
    open: boolean;
    setOpen: (open: boolean) => void;
}
export default function Cart({ open, setOpen }: Readonly<OpenPorp>) {

    const cartItems = useSelector((state: RootState) => state.cart.cartItems);
    const dispatch = useDispatch();
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        const total = cartItems.reduce((acc, product) => acc + product.price * product.quantity, 0);
        setSubtotal(total);
    }, [cartItems]);

    return (
        <Dialog open={open} onClose={setOpen} className="relative z-60 top-[60px] " >
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/50 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
            />

            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <DialogPanel
                            transition
                            className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
                        >
                            <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-[#0F0F12] shadow-xl">
                                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                    <div className="flex items-start justify-between">
                                        <DialogTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">Shopping cart</DialogTitle>
                                        <div className="ml-3 flex h-7 items-center">
                                            <button
                                                type="button"
                                                onClick={() => setOpen(false)}
                                                className="relative -m-2 p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                                            >
                                                <span className="absolute -inset-0.5" />
                                                <span className="sr-only">Close panel</span>
                                                <XMarkIcon aria-hidden="true" className="size-6" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <div className="flow-root">
                                            <ul className="-my-6 divide-y divide-gray-200">
                                                {cartItems && cartItems.length > 0 ? (
                                                    cartItems.map((product) => (
                                                        <li key={product.id} className="flex py-6">
                                                            <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                <img alt={product.id} src={`${process.env.NEXT_PUBLIC_API_URL}/image/${product.image}`}
                                                                    className="size-full object-cover" />
                                                            </div>

                                                            <div className="ml-4 flex flex-1 flex-col">
                                                                <div>
                                                                    <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100">
                                                                        <h3>
                                                                            <a href={product.name}>{product.name}</a>
                                                                        </h3>
                                                                        <p className="ml-4">{formatCurrency(product.price)}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-1 items-end justify-between text-sm ">
                                                                    <p className="text-gray-700 dark:text-gray-300">Quantity: {product.quantity}</p>

                                                                    <div className="flex">
                                                                        <button onClick={() => dispatch(removeFromCart(product.id))} type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <p>Cart is empty</p>
                                                )
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                    <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100">
                                        <p>Subtotal</p>
                                        <p>{formatCurrency(subtotal)}</p>
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                    <div className="mt-6">
                                        <Link
                                            onClick={() => setOpen(false)}
                                            href="/checkout"
                                            className="flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium shadow-xs dark:bg-gray-800 bg-primary text-gray-700 dark:text-gray-300"
                                        >
                                            Checkout
                                        </Link>

                                    </div>
                                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                        <p>
                                            or{' '}
                                            <Button
                                                onClick={() => setOpen(false)}
                                            >
                                                Continue Shopping<span aria-hidden="true">&rarr;</span>
                                            </Button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

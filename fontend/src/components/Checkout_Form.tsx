"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { formatCurrency } from "@/utils/formatCurrency.client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useAddressData from "@/hooks/useAddressData";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";



export default function CheckoutForm() {
    const cartItems = useSelector((state: RootState) => state.cart.cartItems);
    const [clientCart, setClientCart] = useState<typeof cartItems>([]);
    const [useShippingForBilling, setUseShippingForBilling] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("cod");

    useEffect(() => {
        setClientCart(cartItems);
    }, [cartItems]);

    // Sử dụng clientCart thay vì cartItems trong useMemo
    const { subtotal, shipping, taxes, total } = useMemo(() => {
        const subtotal = clientCart.reduce((acc, product) => acc + product.price * product.quantity, 0);
        const shipping = 15000;
        const taxes = Math.round(subtotal * 0.084);
        return { subtotal, shipping, taxes, total: subtotal + shipping + taxes };
    }, [clientCart]);

    const { provinces, districts, wards, fetchDistricts, fetchWards } = useAddressData();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted")
    }
    return (
        <div className="min-h-screen bg-white dark:bg-[#0F0F12] py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
                    {/* Left Column - Form Fields */}
                    <div className="space-y-8">
                        {/* Contact Information */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Contact information</h2>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="email">Phone Number</Label>
                                    <Input type="text" id="phone" name="phone" required className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="email">Full Name</Label>
                                    <Input type="text" id="fullName" name="fullName" required className="mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Shipping address</h2>
                            <div className="space-y-4">
                                {/* Chọn Tỉnh */}
                                <div>
                                    <label htmlFor="province">Province</label>
                                    <Select onValueChange={(value) => {
                                        fetchDistricts(provinces?.find((p) => p.name == value)?.code ?? "");
                                    }}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue
                                                placeholder="Select a province"
                                            />
                                        </SelectTrigger>
                                        <SelectContent className="z-50 bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]  shadow-md rounded-lg">
                                            {provinces?.map((p) => (
                                                <SelectItem key={p.code} value={p.name} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-900 text-gray-900 dark:text-gray-100">
                                                    {p.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Chọn Quận/Huyện */}
                                <div>
                                    <label htmlFor="district">District</label>
                                    <Select onValueChange={(value) => {
                                        fetchWards(districts?.find((p) => p.name == value)?.code ?? "");
                                    }}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select a district" />
                                        </SelectTrigger>
                                        <SelectContent className="z-50 bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]  shadow-md rounded-lg">
                                            {districts?.map((d) => (
                                                <SelectItem key={d.code} value={d.name} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-900  text-gray-900 dark:text-gray-100">
                                                    {d.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Chọn Xã/Phường */}
                                <div>
                                    <label htmlFor="ward">Ward</label>
                                    <Select>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select a ward" />
                                        </SelectTrigger>
                                        <SelectContent className="z-50 bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#17171a]  shadow-md rounded-lg">
                                            {wards?.map((w) => (
                                                <SelectItem key={w.code} value={w.name} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-900  text-gray-900 dark:text-gray-100">
                                                    {w.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="address">Address</Label>
                                    <Input type="text" id="address" name="address" required className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="apartment">Apartment, suite, etc.</Label>
                                    <Input type="text" id="apartment" name="apartment" className="mt-1" />
                                </div>
                            </div>
                        </div>
                        {/* Payment Details */}
                        {/* Chọn phương thức thanh toán */}
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="credit-card" id="credit-card" />
                                <Label htmlFor="credit-card">Credit/Debit Card</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cod" id="cod" />
                                <Label htmlFor="cod">Cash on Delivery (COD)</Label>
                            </div>
                        </RadioGroup>

                        {/* Form nhập thông tin thẻ, chỉ hiển thị nếu chọn "credit-card" */}
                        {paymentMethod === "credit-card" && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="cardName">Name on card</Label>
                                    <Input type="text" id="cardName" name="cardName" required className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="cardNumber">Card number</Label>
                                    <Input type="text" id="cardNumber" name="cardNumber" required className="mt-1" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <Label htmlFor="expiration">Expiration date (MM/YY)</Label>
                                        <Input type="text" id="expiration" name="expiration" placeholder="MM/YY" required className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input type="text" id="cvc" name="cvc" required className="mt-1" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Billing Information */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Billing information</h2>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="billing"
                                    checked={useShippingForBilling}
                                    onCheckedChange={(checked) => setUseShippingForBilling(checked === true)}
                                />
                                <Label htmlFor="billing">Same as shipping information</Label>
                            </div>
                        </div>

                        <div className="text-sm text-gray-500">You won't be charged until the next step.</div>

                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                            Continue
                        </Button>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="bg-white dark:bg-[#0F0F12] p-6 rounded-lg shadow-sm border">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Order summary</h2>
                        <div className="space-y-4">
                            {clientCart && clientCart.length > 0 ? (
                                clientCart.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4">
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                            <Image
                                                src={item?.image ? `${process.env.NEXT_PUBLIC_API_URL}/image/${item.image}` : "/fallback-image.jpg"}
                                                alt="Product Image"
                                                width={64}
                                                height={64}
                                                className="h-full w-full object-cover object-center"
                                                priority
                                                unoptimized
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
                                            <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(item.price)}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Cart is empty</p>
                            )
                            }
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <p className="text-gray-500">Subtotal</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(subtotal)}</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p className="text-gray-500">Shipping</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(shipping)}</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p className="text-gray-500">Taxes</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(taxes)}</p>
                                </div>
                                <div className="flex justify-between text-base font-medium pt-2 border-t">
                                    <p className="text-gray-900 dark:text-gray-100">Total</p>
                                    <p className="text-gray-900 dark:text-gray-100">{formatCurrency(total)}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}


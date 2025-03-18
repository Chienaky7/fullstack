interface redexProduct {
    id: string
    name: string
    price: number
    quantity: number
    image: string
}
interface CartState {
    cartItems: redexProduct[];
}


interface Image {
    name: string;
    preview: string;
    file: File;
}
interface ProductVariantOption {
    name: string
    values: string[]
}
interface ProductVariant {
    type: String;
    value: String;
    price: double;
    stock: int;
    sku: String;
}
interface IProduct {
    id: string
    name: string;
    description: string;
    price: number;
    salePrice: number;
    stock: number;
    sku: string;
    barcode: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    title: string;
    descriptionSeo: string;
    keywords: string;
    status: string;
    featured: boolean;
    taxable: boolean;
    publishDate: string;
    images: Image[];
    category: ICategory;
    variants: ProductVariant[];
}

interface ICategory {
    id: string;
    name: string;
    description?: string;
}

interface Product {
    id: string
    name: string
    description: string
    price: string
    stock: string
    category: string
    images: string[]
}

interface UserInfo {
    id: string;
    username: string;
    image: string;
}
interface Auth {
    token: string;
    user: User;
}
interface User {
    id: string;
    password?: string
    avatar: Image;
    username: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    role: Role;
}
interface Role {
    description: string;
    name: string;
    permissions: Permission[];
}
interface Permission {
    description: string;
    name: string;
}
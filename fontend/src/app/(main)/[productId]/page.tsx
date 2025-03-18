import ProductOverviews from '@/components/main/product/Product_Overviews'

export default async function Page({
    params,
}: {
    readonly params: Promise<{ productId: string }>
}) {
    const productId = (await params).productId
    return (
        <ProductOverviews productId={productId} />
    )
}
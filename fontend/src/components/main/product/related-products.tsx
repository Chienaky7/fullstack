import Image from "next/image"
import { StarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface RelatedProductsProps {
    readonly products: ReadonlyArray<{
        name: string
        price: string
        image: string
    }>
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {products.map((product, index) => (
                <Card key={product.name} className="overflow-hidden group">
                    <div className="relative aspect-square bg-muted">
                        <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover object-center transition-transform group-hover:scale-105 duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    </div>
                    <CardContent className="p-3 md:p-4">
                        <h3 className="font-medium text-sm md:text-base line-clamp-1">{product.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-sm md:text-base">{product.price}</span>
                            <div className="flex items-center">
                                <StarIcon className="h-3 w-3 md:h-4 md:w-4 fill-primary text-primary" />
                            </div>
                        </div>
                        <Button variant="outline" className="w-full mt-3 md:mt-4 text-sm h-8 md:h-10 md:text-base">
                            View Product
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}


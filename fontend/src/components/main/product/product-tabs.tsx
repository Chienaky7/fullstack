"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { CheckIcon, StarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductTabsProps {
    product: {
        name?: string
        images: Image[]
    }
}

export default function ProductTabs({ product }: Readonly<ProductTabsProps>) {
    // Example reviews data
    const reviews = [
        {
            name: "Alex Johnson",
            date: "March 10, 2025",
            rating: 5,
            comment: "This product exceeded all my expectations. The quality is exceptional and the design is perfection.",
            verified: true,
        },
        {
            name: "Sam Rodriguez",
            date: "March 5, 2025",
            rating: 4,
            comment: "Beautifully crafted and comfortable. Only giving 4 stars because shipping took longer than expected.",
            verified: true,
        },
        {
            name: "Taylor Smith",
            date: "February 28, 2025",
            rating: 5,
            comment: "Absolutely love this! Fits perfectly and the material feels premium. Will definitely buy more.",
            verified: true,
        },
    ]

    return (
        <Tabs defaultValue="description">
            <div className="relative w-full mb-6">
                <div className="overflow-x-auto pb-1 scrollbar-hide">
                    <TabsList className="w-full border-b h-auto justify-start rounded-none px-0 pb-px inline-flex min-w-max">
                        <TabsTrigger
                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-3 md:px-4 pb-3 whitespace-nowrap"
                            value="description"
                        >
                            Description
                        </TabsTrigger>
                        <TabsTrigger
                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-3 md:px-4 pb-3 whitespace-nowrap"
                            value="details"
                        >
                            Details & Care
                        </TabsTrigger>
                        <TabsTrigger
                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-3 md:px-4 pb-3 whitespace-nowrap"
                            value="delivery"
                        >
                            Shipping & Returns
                        </TabsTrigger>
                        <TabsTrigger
                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-3 md:px-4 pb-3 whitespace-nowrap"
                            value="reviews"
                            id="reviews"
                        >
                            Reviews
                        </TabsTrigger>
                    </TabsList>
                </div>
                <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden"></div>
            </div>

            <TabsContent value="description" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div>
                        <h3 className="text-lg md:text-xl font-medium mb-4">Luxury in Every Thread</h3>
                        <div className="prose prose-sm md:prose-base prose-stone dark:prose-invert max-w-none">
                            <p>
                                Elevate your wardrobe with our Premium Cashmere Sweater, a true embodiment of luxury and comfort.
                                Crafted from the finest grade 7 Mongolian cashmere, known for its exceptional softness and warmth, this
                                piece represents the pinnacle of quality craftsmanship.
                            </p>
                            <p>
                                Our sweaters are designed with a modern silhouette that flatters all body types while maintaining the
                                timeless appeal that makes cashmere an enduring favorite. The refined ribbed detailing at the cuffs,
                                hem, and neckline adds subtle sophistication to the clean lines of this essential piece.
                            </p>
                            <p>
                                Each sweater undergoes a meticulous 12-step quality control process, ensuring that the garment you
                                receive is nothing short of perfect. We're confident that once you experience the unparalleled luxury of
                                our cashmere, it will become an indispensable part of your wardrobe for years to come.
                            </p>
                        </div>
                    </div>
                    <div className="relative aspect-square lg:aspect-auto rounded-lg overflow-hidden bg-muted">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/image/${product?.images[0]?.name}`}
                            alt="Model wearing cashmere sweater"
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 100vw, 500px"
                        />
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="details" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                    <div>
                        <h3 className="text-base md:text-lg font-medium mb-3">Materials</h3>
                        <p className="text-muted-foreground text-sm md:text-base">
                            100% Grade 7 Mongolian Cashmere
                            <br />
                            300+ GSM weight for exceptional warmth
                            <br />
                            2-ply yarn construction for durability
                        </p>
                    </div>
                    <div>
                        <h3 className="text-base md:text-lg font-medium mb-3">Fit & Sizing</h3>
                        <p className="text-muted-foreground text-sm md:text-base">
                            Regular fit, true to size
                            <br />
                            Model is 6'1" and wears size M<br />
                            Designed for a relaxed yet tailored silhouette
                        </p>
                    </div>
                    <div className="sm:col-span-2 md:col-span-1">
                        <h3 className="text-base md:text-lg font-medium mb-3">Care Instructions</h3>
                        <p className="text-muted-foreground text-sm md:text-base">
                            Hand wash cold or dry clean
                            <br />
                            Lay flat to dry
                            <br />
                            Store folded in a drawer with cedar blocks
                            <br />
                            Use a cashmere comb to remove pilling
                        </p>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="delivery" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div>
                        <h3 className="text-base md:text-lg font-medium mb-3">Shipping</h3>
                        <ul className="space-y-2 text-sm md:text-base">
                            <li className="flex gap-2">
                                <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-600" />
                                <span>Free carbon-neutral shipping on all orders</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-600" />
                                <span>Standard delivery: 3-5 business days</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-600" />
                                <span>Express delivery (+ $15): 1-2 business days</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-600" />
                                <span>International shipping available to 40+ countries</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-base md:text-lg font-medium mb-3">Returns & Exchanges</h3>
                        <ul className="space-y-2 text-sm md:text-base">
                            <li className="flex gap-2">
                                <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-600" />
                                <span>Free returns within 30 days of delivery</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-600" />
                                <span>Items must be unworn with original tags attached</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-600" />
                                <span>Exchanges available for different sizes and colors</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-600" />
                                <span>Return label included in every order</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
                <div className="space-y-6 md:space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-lg md:text-xl font-medium">Customer Reviews</h3>
                            <div className="flex flex-wrap items-center mt-1 gap-y-1">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            className={`h-4 w-4 md:h-5 md:w-5 fill-muted text-muted`}
                                        />
                                    ))}
                                </div>
                                <span className="ml-2 text-sm font-medium"> out of 5</span>
                                <span className="mx-2 text-sm text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">Based on reviews</span>
                            </div>
                        </div>
                        <Button className="w-full sm:w-auto">Write a Review</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                        <div className="col-span-1 md:order-1">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="w-2 mr-2">5</span>
                                        <StarIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="w-full max-w-[180px] h-2 bg-muted rounded-full overflow-hidden ml-2">
                                        <div className="bg-primary h-full rounded-full" style={{ width: "75%" }} />
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-2">75%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="w-2 mr-2">4</span>
                                        <StarIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="w-full max-w-[180px] h-2 bg-muted rounded-full overflow-hidden ml-2">
                                        <div className="bg-primary h-full rounded-full" style={{ width: "20%" }} />
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-2">20%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="w-2 mr-2">3</span>
                                        <StarIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="w-full max-w-[180px] h-2 bg-muted rounded-full overflow-hidden ml-2">
                                        <div className="bg-primary h-full rounded-full" style={{ width: "5%" }} />
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-2">5%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="w-2 mr-2">2</span>
                                        <StarIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="w-full max-w-[180px] h-2 bg-muted rounded-full overflow-hidden ml-2">
                                        <div className="bg-primary h-full rounded-full" style={{ width: "0%" }} />
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-2">0%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="w-2 mr-2">1</span>
                                        <StarIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="w-full max-w-[180px] h-2 bg-muted rounded-full overflow-hidden ml-2">
                                        <div className="bg-primary h-full rounded-full" style={{ width: "0%" }} />
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-2">0%</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-3 order-1 md:order-2">
                            <div className="space-y-4 md:space-y-6">
                                {reviews.map((review, index) => (
                                    <Card key={index}>
                                        <CardContent className="p-4 md:p-6">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium">{review.name}</h4>
                                                        {review.verified && (
                                                            <Badge variant="outline" className="text-xs">
                                                                Verified Purchase
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                                                </div>
                                                <div className="flex">
                                                    {Array.from({ length: 5 }, (_, i) => (
                                                        <StarIcon
                                                            key={`${review.name}-${i}`}
                                                            className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mt-3 md:mt-4 text-sm md:text-base">{review.comment}</p>
                                            <div className="flex gap-2 mt-3 md:mt-4">
                                                <Button variant="outline" size="sm">
                                                    Helpful
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    Report
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button variant="outline" className="w-full">
                                    Load More Reviews
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    )
}


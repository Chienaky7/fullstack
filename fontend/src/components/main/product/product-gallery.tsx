"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface ProductGalleryProps {
    readonly images: Image[]
    readonly isNewArrival?: boolean
}

export default function ProductGallery({ images, isNewArrival }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0)

    return (
        <div className="space-y-3 md:space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/image/${images[activeImage]?.name}`}
                    alt="Product image"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
                {isNewArrival && (
                    <Badge className="absolute top-3 left-3 md:top-4 md:left-4 bg-primary text-primary-foreground">
                        New Arrival
                    </Badge>
                )}
            </div>

            <div className="grid grid-cols-4 gap-2 md:gap-3">
                {images.map((image, index) => (
                    <button
                        key={image.name}
                        className={`relative aspect-square overflow-hidden rounded-md ${index === activeImage ? "ring-2 ring-primary" : "ring-1 ring-muted"
                            }`}
                        onClick={() => setActiveImage(index)}
                    >
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/image/${image.name}`}
                            alt={`Product thumbnail ${index + 1}`}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 25vw, 150px"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}


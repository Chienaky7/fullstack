import { Settings, Monitor, AlignLeft } from "lucide-react"

export default function ProductGuarantee() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 bg-muted/50 rounded-lg p-4 md:p-8">
            <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Settings className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="font-medium text-sm md:text-base">2-Year Guarantee</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                    Every product is covered by our comprehensive quality guarantee.
                </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Monitor className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="font-medium text-sm md:text-base">Free Carbon-Neutral Shipping</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                    We offset all carbon emissions produced by shipping our products.
                </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 sm:col-span-2 md:col-span-1">
                <div className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <AlignLeft className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="font-medium text-sm md:text-base">Easy Returns</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                    30-day hassle-free returns with prepaid shipping labels included.
                </p>
            </div>
        </div>
    )
}


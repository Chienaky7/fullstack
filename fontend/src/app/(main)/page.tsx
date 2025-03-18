
import PromoSections from "@/components/Promo_Sections";
import CategoryPreviews from "@/components/Category_Previews";
import ProductLists from "@/components/Product_Lists";
import ProductFeatures from "@/components/Product_Features";

export default function MainPage() {
    return (
        <>
            <PromoSections />
            <CategoryPreviews />
            <ProductLists />
            <ProductFeatures />
        </>
    );
}
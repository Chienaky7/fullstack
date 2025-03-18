import Layout from "@/components/dashboard/layout";

export default function AdminLayout({ children }: { readonly children: React.ReactNode }) {
    return (
        <Layout>
            {children}
        </Layout>
    );
}
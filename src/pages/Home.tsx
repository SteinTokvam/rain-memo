import Faq from "@/components/Home/Faq";
import Features from "@/components/Home/Features";
import Hero from "@/components/Home/Hero";
import DefaultLayout from "@/layouts/default";

export default function Home() {
    return (
        <DefaultLayout supabase={null}>
            <div>
                <Hero />
                <Features />
                <Faq />
                {
                /*
                
                <Trial />
                */
                }
            </div>
        </DefaultLayout>
    );
}

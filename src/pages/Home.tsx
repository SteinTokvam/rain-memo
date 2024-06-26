import Faq from "@/components/Home/Faq";
import Features from "@/components/Home/Features";
import Hero from "@/components/Home/Hero";
import { routes } from "@/global";
import DefaultLayout from "@/layouts/default";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home({ supabase }: { supabase: SupabaseClient }) {

    const navigate = useNavigate();
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate(routes.dashboard)
            }
        })
    }, [])
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

import { setSession } from "@/actions/user";
import { routes } from "@/global";
import { Button } from "@nextui-org/button";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


export default function ConfirmEmail({supabase}: {supabase: SupabaseClient}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => {
            supabase.auth.signOut().then(() => {
                dispatch(setSession(null));
              });    
        }, 2000)
        
    }, [])
    return (
    <>
        <p>Sjekk innboksen din for å bekrefte e-post adressen din.</p>
        <Button onPress={() => navigate(routes.home)}>Gå til bake til forsiden.</Button>
    </>)
}
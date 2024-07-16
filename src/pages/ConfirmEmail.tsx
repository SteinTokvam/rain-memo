import { setSession } from "@/actions/user";
import { routes } from "@/global";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/react";
import { SupabaseClient } from "@supabase/supabase-js";
import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


export default function ConfirmEmail({supabase}: {supabase: SupabaseClient}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation('confirmEmail');

    useEffect(() => {
        setTimeout(() => {
            supabase.auth.signOut().then(() => {
                dispatch(setSession(null));
              });    
        }, 2000)
        
    }, [])
    return (
    <Suspense fallback={<Spinner />}>
        <p>{t('text')}</p>
        <Button onPress={() => navigate(routes.home)}>{t('button')}</Button>
    </Suspense>)
}
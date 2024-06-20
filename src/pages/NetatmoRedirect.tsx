import { getNetatmoClientIdAndSecret, routes } from "@/global"
import { SupabaseClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"


export default function NetatmoRedirect({ supabase }: { supabase: SupabaseClient }) {
    const state = localStorage.getItem("state") as string
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (state !== location.search.split('&')[0]) {
            console.error("Invalid state")
            localStorage.removeItem("state")
            //return
        }

        const code = location.search.split('&')[1].split('=')[1]

        getNetatmoClientIdAndSecret(supabase)
            .then(res => {
                if (res.error) {
                    return
                }

                const grant_type = "authorization_code"
                const scope = "read_station"

                const data = {
                    'grant_type': grant_type,
                    'client_id': res.data ? res.data.client_id : "",
                    'client_secret': res.data ? res.data?.client_secret : "",
                    'code': code,
                    'scope': scope,
                    'redirect_uri': "http://localhost:5173/netatmo/redirect"
                }
                fetch(`https://api.netatmo.com/oauth2/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(data)
                }).then(res => res.json())

                    .then(data => {
                        console.log(data)
                        if (data.error) {
                            console.error(data.error)
                            return
                        }

                        supabase
                            .from('netatmo_user_info')
                            .insert({
                                access_token: data.access_token,
                                refresh_token: data.refresh_token,
                                expires_at: Date.now() + data.expires_in * 1000,
                            })
                            .then(res => {
                                console.log(res)
                            })
                            window.setTimeout(() => {
                                navigate(routes.dashboard)        
                            }, 3000)
                        
                    })
            })


    }, [])
    return (
        <div>
            Redirecting...
        </div>
    )
}
import { routes } from "@/global";
import DefaultLayout from "@/layouts/default"
import { Button } from "@nextui-org/button"
import { useNavigate } from "react-router-dom"


export default function Home() {

    const navigate = useNavigate();

    return (
        <DefaultLayout supabase={null}>
            <div>
                <h1>Home</h1>
            </div>
        </DefaultLayout>
    )
}
import { routes } from "@/global";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";


export default function Hero() {
    const navigate = useNavigate();
    return (
        <div >
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <div className="p-8 max-w-xl">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 sm:text-4xl">Klar for å begynne?</h2>
                    <p>Opplev nøyaktig og pålitelig nedbørsdata rett fra Netatmo sin regnmåler. Appen gir deg sanntidsinformasjon om nedbørsmengde, slik at du alltid er forberedt på værforandringer. Enten du planlegger hagearbeid, utendørsaktiviteter eller bare vil følge med på været, vil appen hjelpe deg med å ta bedre beslutninger.</p>
                    <Button color="primary" className="mt-8 hidden lg:block">Registrer deg eller logg inn</Button>
                </div>
                <Image src="https://placehold.co/600x400" alt="hero" width={600} height={400} />
                <Button color="primary" className="mt-8 lg:hidden" onClick={() => navigate(routes.dashboard)}>Registrer deg eller logg inn</Button>
            </div>

        </div>
    )
}
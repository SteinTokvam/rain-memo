import { routes } from "@/global";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


export default function Hero() {
    const navigate = useNavigate();
    const { t } = useTranslation(['landing']);
    return (
        <div >
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <div className="p-8 max-w-xl">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 sm:text-4xl">{t('hero.title')}</h2>
                    <p>{t('hero.text')}</p>
                    <Button color="primary" className="mt-8 hidden lg:block">{t('hero.button')}</Button>
                </div>
                <Image src="https://placehold.co/600x400" alt="hero" width={600} height={400} />
                <Button color="primary" className="mt-8 lg:hidden" onClick={() => navigate(routes.dashboard)}>{t('hero.button')}</Button>
            </div>

        </div>
    )
}
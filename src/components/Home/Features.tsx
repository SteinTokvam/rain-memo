
import { useTranslation } from 'react-i18next';

export default function Features() {
    const { t } = useTranslation(['landing']);
    return (
        <div className="grid gitd-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 bg-default-100">
            <div className="">
                <h2 className="text-3xl font-bold">{t('features.stats.header')}</h2>
                <p>{t('features.stats.text')}</p>
            </div>
            <div className="">
                <h2 className="text-3xl font-bold">{t('features.graphs.header')}</h2>
                <p>{t('features.graphs.text')}</p>
            </div>
            <div className="">
                <h2 className="text-3xl font-bold">{t('features.filter.header')}</h2>
                <p>{t('features.filter.text')}</p>
            </div>

            <div className="">
                <h2 className="text-3xl font-bold">{t('features.events.header')}</h2>
                <p>{t('features.events.text')}</p>
            </div>
        </div>
    );
}
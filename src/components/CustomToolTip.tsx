import { useTranslation } from "react-i18next";

// @ts-ignore
export default function CustomToolTip({ active, payload }) {
    const { t } = useTranslation();
    if (active && payload && payload.length) {
        return (
            <>
                {payload.map((pld: any) => (
                    <div key={pld.payload.date} className="bg-slate-800 text-white p-2 max-w-32">
                        <div className="bg-slate-600 text-white p-2 font-bold">
                            {pld.payload.date}
                        </div>

                        <div>
                            <p>{t('rain', { rain: pld.payload.amount })}</p>
                        </div>
                        {pld.payload.event_text &&
                            <div>
                                <p>{t('event', { event: pld.payload.event_text })}</p>
                            </div>
                        }
                    </div>
                ))}
            </>
        );
    }

    return null;
}

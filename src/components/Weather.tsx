import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SVG from 'react-inlinesvg';
import { useDraggable } from "react-use-draggable-scroll";


export default function Weather({ longitude, latitude }: { longitude: string, latitude: string }) {
    const [weatherData, setWeatherData] = useState<any>();
    const [icon, setIcon] = useState<{ iconName: string, icon: string }[]>([]);

    const ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
    const { events } = useDraggable(ref); // Now we pass the reference to the useDraggable hook:
    const { t } = useTranslation('translation');

    useEffect(() => {
        fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
                data.properties.timeseries.filter((data: any) => data.data.next_1_hours).forEach((element: any) => {
                    fetchIcon(element.data.next_1_hours.summary.symbol_code)
                });
                setWeatherData(data)
            })

        const noSelectElements =
            document.querySelectorAll(".no-select");
        noSelectElements.forEach((element: any) => {
            element.style.webkitUserSelect = "none";
            element.style.mozUserSelect = "none";
            element.style.msUserSelect = "none";
            element.style.userSelect = "none";
        });
    }, [])

    function fetchIcon(iconName: string) {
        setIcon(prevState => {
            const alreadyAdded = prevState.find((data: any) => data.iconName === iconName)
            return alreadyAdded ? prevState : [...prevState, { iconName, icon: `https://raw.githubusercontent.com/metno/weathericons/main/weather/svg/${iconName}.svg` }]
        })
    }

    function getWindDirectionArrow(direction: number, speed: number) {
        let ret = ""
        if (direction >= 0 && direction < 67.5 || direction >= 270) {//north
            ret = `⬇`
        } else if (direction >= 67.5 && direction < 135) {//east
            ret = `⬅`
        } else if (direction >= 135 && direction < 202.5) {//south
            ret = `⬆`
        } else if (direction >= 202.5 && direction < 270) {//west
            ret = `➡`
        }
        return `${ret} ${speed} m/s`
    }

    return (
        <div className="w-full sm:max-w-7xl">

            <div className="flex flex-row flex-no-wrap overflow-x-auto"
                {...events}
                ref={ref}
            >
                {
                    weatherData && weatherData.properties.timeseries.map((data: any) => {
                        if (!data.data.next_1_hours) return
                        return (
                            <div key={data.time}>
                                <div className="no-select p-4 grid flex-none w-28">
                                    <SVG
                                        src={icon.filter((icon: any) => icon.iconName === data.data.next_1_hours.summary.symbol_code)[0].icon}
                                        title={data.data.next_1_hours.summary.symbol_code}
                                        aria-label={data.data.next_1_hours.summary.symbol_code}
                                        width={58}
                                        height={"auto"}
                                    />
                                    <div className="no-select">
                                        {new Date(data.time).toLocaleString("no", { timeZone: "Europe/Oslo" })
                                            .split(",").map((elem: string) => <h1>{elem}</h1>)}
                                        <p>{data.data.instant.details.air_temperature.toFixed(0)}{'\u00B0'}C</p>
                                        {data.data.next_1_hours.details.precipitation_amount ? <p>{data.data.next_1_hours.details.precipitation_amount} mm</p> : "0 mm"}
                                        <p>{getWindDirectionArrow(data.data.instant.details.wind_from_direction, data.data.instant.details.wind_speed)}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <p className="text-left text-default-600">{t('weatherAttribution')}</p>
        </div>
    )
}
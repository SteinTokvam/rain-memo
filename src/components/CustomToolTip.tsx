
// @ts-ignore
export default function CustomToolTip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <>
                {
                    payload.map((pld: any) => (
                        <div className="bg-slate-800 text-white p-2">
                            <div className="bg-slate-600 text-white p-2 font-bold">{payload[0].payload.date}</div>
                            
                            <div>
                                <p>
                                    Nedbør: {payload[0].payload.amount} mm
                                </p>
                            </div>
                        </div >

                    ))
    }
            </>
        )
}
return null
}
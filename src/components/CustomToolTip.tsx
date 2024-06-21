// @ts-ignore
export default function CustomToolTip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <>
        {payload.map((pld: any) => (
          <div key={pld.payload.date} className="bg-slate-800 text-white p-2">
            <div className="bg-slate-600 text-white p-2 font-bold">
              {pld.payload.date}
            </div>

            <div>
              <p>Nedbør: {pld.payload.amount} mm</p>
            </div>
          </div>
        ))}
      </>
    );
  }

  return null;
}

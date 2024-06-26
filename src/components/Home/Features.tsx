

export default function Features() {
    return (
        <div className="grid gitd-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 bg-default-100">
            <div className="">
                <h2 className="text-3xl font-bold">Statistikk</h2>
                <p>Få oversikt over hver eneste regndag, og trykk deg inn på en dag for å se når den dagen det regnet!</p>
            </div>
            <div className="">
                <h2 className="text-3xl font-bold">Grafer</h2>
                <p>Visualiser regnmengdene i en enkelt graf. Støtter visning av graf for alle regndager, men også for en enkelt dag.</p>
            </div>
            <div className="">
                <h2 className="text-3xl font-bold">Filtrering</h2>
                <p>Filtrer oversikten til å vise data for bare den inneværende måneden, forrige måned eller forrige uke. Du kan også velge å egne datoer å vise data for.</p>
            </div>
        </div>
    );
}
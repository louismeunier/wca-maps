import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { getUserCompetitions, searchUsers } from "@logic/wca-api";
import { averageGeoPoint } from "@logic/calculations";
import type { LatLngExpression } from "leaflet";
import { LocationStats } from "@components/Stats/LocationStats";
import { Loading } from "./Loading";

const MapLayer = dynamic(() => import("@components/Map/MapLayer"), {
    ssr: false
})

const MapWithNoSSR = dynamic(() => import("@components/Map/Map"), {
    ssr: false
});

export default function FrontPage():JSX.Element {
    //utils
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [autocomplete, setAutocomplete] = useState<WCAUser[]|null>(null);
    //passed to the map
    const [layers, setLayers] = useState<JSX.Element[]>([]);
    const [center, setCenter] = useState<LatLngExpression>([0,0])
    //used for stats
    const [wcaData, setWcaData] = useState<WCAUser|null>(null);
    const [competitionData, setCompetitionData] = useState<WCACompetition[]|null>(null);

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)  => {
        e.target.value === "" 
        ? setAutocomplete(null)
        : searchUsers(e.target.value)
            .then(res => {
                const filteredUsers:WCAUser[] = res.result.filter(user => user.wca_id).slice(0,5);
                setAutocomplete(filteredUsers);
            })
            .catch(err => {
                alert("An error occurred! Please refresh the page.")
            })
    }
    
    const handleClick = () => {
        setCompetitionData(null);
        if (!wcaData || !wcaData?.wca_id) return;
        setIsLoading(true)
        getUserCompetitions(wcaData.wca_id)
            .then(res => {
                Promise.all(res)
                    .then(resArr => {
                        const layers:JSX.Element[] = [];
                        const filteredCompetitions:WCACompetition[] = resArr.filter(competition => {
                            if (competition.city.toLowerCase().match(/multiple cities/g)) return false
                            else return true
                        });

                        const coordinateArray:number[][] = filteredCompetitions.map((competition, index)=> {
                            layers.push(<MapLayer key={index+1} position={[competition.latitude_degrees, competition.longitude_degrees]} message={`${competition.name}`}/>)
                            return [competition.latitude_degrees, competition.longitude_degrees]
                        })

                        setCompetitionData(filteredCompetitions);

                        const averageCoordinate:LatLngExpression = averageGeoPoint(coordinateArray)

                        setCenter(averageCoordinate);
                        setLayers([<MapLayer notable key={0} position={averageCoordinate} message={`Average`}/>, ...layers])
                        setIsLoading(false)
                    })
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        handleClick();
    }, [wcaData])

    useEffect(() => {
        setAutocomplete(null)
    }, [competitionData])

    return (
        <>
        {/* Could make this a portal? */}
            {
                isLoading && (
                <div className="absolute top-1/2 left-1/2 z-50">
                    <Loading/>
                </div>
                )
            }

            <div className="w-screen h-screen m-0">
                <div className="fixed w-1/3 h-full left-0 z-50 bg-gray-400 border-gray-800 border-2 rounded-r-xl bg-opacity-50">
                    <h1 className="top-0 underline font-bold italic text-black text-4xl absolute w-full text-center">
                        WCA Mapping
                    </h1>
                    <div className="grid place-items-center h-full">
                        <div className="w-2/3 h-1/3 flex flex-col content-center">
                                <div className="sticky text-center bg-gray-200 rounded-xl">{
                                    wcaData && competitionData && (
                                        <LocationStats wcaData={wcaData} locationData={competitionData} center={center}/>
                                    )
                                } </div>
                            <input 
                                className={`w-full p-2 text-center ${autocomplete ? "rounded-t-xl" : "rounded-xl"}`} 
                                placeholder="Start typing a name or WCA ID" 
                                onChange={ handleChange } 
                                type="text"/>
                            <div className="sticky text-center bg-gray-200 rounded-b-xl">                               
                                {
                                    autocomplete && autocomplete.map((user, key) => {
                                        return (
                                            <div 
                                                onClick={() => setWcaData(user)}
                                                className = "group p-2 text-center border-t-2 border-gray-500 hover: cursor-pointer" 
                                                key={key}
                                                >
                                                <span className="group-hover:text-blue-600 underline text-lg">
                                                    {user.name}
                                                    <span className="group-hover:text-blue-600 no-underline text-sm">
                                                        ({user.wca_id})
                                                    </span>
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="absolute text-center w-full bottom-0">
                        <h1 className="">
                            made by <a 
                                className="underline text-blue-400"
                                target="_blank"
                                rel="noreferrer"
                                href="https://github.com/louismeunier"
                            >
                                 louismeunier
                            </a>
                        </h1>
                    </div>
                </div>
                <MapWithNoSSR center={center} layers={layers}/>
            </div>
        </>
    )
}
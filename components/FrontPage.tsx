import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { getUserCompetitions, searchUsers } from "@logic/wca-api";
import { averageGeoPoint } from "@logic/calculations";
import type { LatLngExpression } from "leaflet";
//import { LocationStats } from "@components/LocationStats";
import { Loading } from "./Loading";

const MapLayer = dynamic(() => import("@components/MapLayer"), {
    ssr: false
})

const MapWithNoSSR = dynamic(() => import("@components/Map"), {
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
                alert("error")
            })
    }
    
    const handleClick = () => {
        if (!wcaData || !wcaData?.wca_id) return;
        setIsLoading(true)
        getUserCompetitions(wcaData.wca_id)
            .then(res => {
                Promise.all(res)
                    .then(resArr => {
                        const layers:JSX.Element[] = [];
                        const filteredCompetitions:WCACompetition[] = resArr.filter(competition => {
                            if (competition.city.toLowerCase() === 'multiple cities') return false
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
                <div className="fixed w-1/3 h-full left-0 z-50 bg-gray-400 border-gray-600 border-2 rounded-r-xl bg-opacity-75">
                    <h1 className="top-0 underline text-blue-400 text-4xl absolute w-full text-center">WCA Map Stats</h1>
                    <div className="grid place-items-center h-full">
                        <div className="w-2/3 h-1/3 flex flex-col content-center">
                            {/* I'm pretty sure this logic will break when built; I've had that problem before */}
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
                                                className = {
                                                    key === 0
                                                    ? "group p-2 text-center border-t-2 border-gray-500 hover: cursor-pointer hover:bg-gray-300" 
                                                    : "group p-2 text-center border-t-2 border-gray-500 hover: cursor-pointer hover:bg-gray-300 rounded-b-xl" 
                                                }
                                                key={key}
                                                >
                                                <span className="group-hover:text-gray-600 underline text-lg">
                                                    {user.name}
                                                    <span className="group-hover:text-gray-600 no-underline text-sm">
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
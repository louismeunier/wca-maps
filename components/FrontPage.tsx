import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { getUserCompetitions, searchUsers } from "@logic/wca-api";
import { averageGeoPoint } from "@logic/calculations";
import type { LatLngExpression } from "leaflet";

const MapLayer = dynamic(() => import("@components/MapLayer"), {
    ssr: false
})

const MapWithNoSSR = dynamic(() => import("@components/Map"), {
    ssr: false
});

export default function FrontPage():JSX.Element {
    const [layers, setLayers] = useState<JSX.Element[]>([]);
    const [wcaID, setWcaID] = useState<string|null>(null);
    const [autocomplete, setAutocomplete] = useState<WCAUser[]|null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [center, setCenter] = useState<LatLngExpression>([0,0])

    const handleChange = (e: { target: { value: any; }; }) => {
        searchUsers(e.target.value)
            .then(res => {
                const filteredUsers:WCAUser[] = res.result.filter(user => user.wca_id).slice(0,5);
                setAutocomplete(filteredUsers);
            })
            .catch(err => {
                alert("error")
            })
    }
    
    const handleClick = () => {
        if (wcaID) {
            setIsLoading(true)
            getUserCompetitions(wcaID)
                .then(res => {
                    Promise.all(res)
                        .then(resArr => {
                            const layers:JSX.Element[] = [];
                            const coordinateArray:number[][] = resArr.filter(competition => {
                                if (competition.city.toLowerCase() === 'multiple cities') return false
                                else return true
                            }).map((competition, index)=> {
                                layers.push(<MapLayer key={index+1} position={[competition.latitude_degrees, competition.longitude_degrees]} message={`${competition.name}`}/>)
                                return [competition.latitude_degrees, competition.longitude_degrees]
                                })

                            const averageCoordinate:LatLngExpression = averageGeoPoint(coordinateArray)
                            setCenter(averageCoordinate)
                            setLayers([<MapLayer notable key={0} position={averageCoordinate} message={`Average`}/>, ...layers])
                            setIsLoading(false)
                        })
                })
                .catch(err => console.error(err))
        }
    }

    useEffect(() => {
        handleClick()
    }, [wcaID])

    return (
        <div className="w-full h-full m-0 grid grid-cols-1">
                <div className="absolute z-50 h-full left-0 w-1/3 border-gray-800 bg-gray-200 border-2 bg-opacity-70 rounded-lg grid place-items-center">
                    <div className="h-1/3 grid place-items-center">
                        <h1>Search for a user</h1>
                        {isLoading && <h1 className="text-red-500 absolute italic">Loading...</h1>}
                        <div>
                            <input className="rounded-lg" placeholder="Begin typing..." onChange={handleChange} type="text"></input>
                            <div className="absolute">
                                {autocomplete && autocomplete.map((user, index) => {
                                    return (
                                        <h2 
                                            className="text-gray-500 hover: cursor-pointer"
                                            onClick={() => {
                                                setWcaID(user.wca_id);
                                            }} 
                                            key={index}>
                                                {user.name} <span className="text-sm italic">({user.wca_id})</span>
                                        </h2>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <MapWithNoSSR center={center} layers={layers}/>
        </div>
    )
}
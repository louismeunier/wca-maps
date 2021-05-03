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
    const [centers, setCenters] = useState<LatLngExpression[]>([])
    const [curCenter, setCurCenter] = useState<LatLngExpression>([0,0])
    //used for stats
    const [userData, setUserData] = useState<userMetaData[]>([]);
    //const [wcaData, setWcaData] = useState<WCAUser|null>(null);
    //const [competitionData, setCompetitionData] = useState<WCACompetition[]|null>(null);

    //
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)  => {
        e.target.value === "" 
        ? setAutocomplete(null)
        : setTimeout(() => {
            searchUsers(e.target.value)
                .then(res => {
                    const filteredUsers:WCAUser[] = res.result.filter(user => user.wca_id && userData.map(u => u.user.wca_id).indexOf(user.wca_id) === -1 ).slice(0,5);
                    setAutocomplete(filteredUsers);
                })
                .catch(err => {
                    alert("An error occurred! Please refresh the page.")
                })
            }, 500
        )
    }
    
    const handleClick = (user:WCAUser) => {
        //setCompetitionData(null);
        //if (!wcaData || !wcaData?.wca_id) return;
        
        setIsLoading(true)
        
        if (!user.wca_id) return;
        //will probably have to add some sort of checking here to see if the user has already been added...
        getUserCompetitions(user.wca_id)
            .then(res => {
                Promise.all(res)
                    .then(resArr => {
                        const newLayers:JSX.Element[] = [];
                        const filteredCompetitions:WCACompetition[] = resArr.filter(competition => {
                            if (competition.city.toLowerCase().match(/multiple cities/g)) return false
                            else return true
                        });

                        setUserData([...userData, 
                            {
                                'user': user,
                                'competitions': filteredCompetitions
                            }
                        ])

                        const coordinateArray:number[][] = filteredCompetitions.map((competition, index)=> {
                            newLayers.push(<MapLayer key={index+1} position={[competition.latitude_degrees, competition.longitude_degrees]} message={`${competition.name}, ${user.name}`}/>)
                            return [competition.latitude_degrees, competition.longitude_degrees]
                        })

                        //setCompetitionData(filteredCompetitions);

                        const averageCoordinate:LatLngExpression = averageGeoPoint(coordinateArray)
                        setCurCenter(averageCoordinate);
                        setCenters([...centers, averageCoordinate]);
                        setLayers([...layers, <MapLayer notable key={0} position={averageCoordinate} message={`Average: ${user.name}`}/>, ...newLayers])
                        setIsLoading(false)
                    })
            })
            .catch(err => console.error(err))
    }

    const handleClear = () => {
        setLayers([]);
        setCenters([]);
        setUserData([]);
        setCurCenter([0,0]);
    }

    // useEffect(() => {
    //     handleClick();
    // }, [wcaData])

    useEffect(() => {
        setAutocomplete(null)
    }, [userData])

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
                                    userData.length>0 && (
                                        <LocationStats userData={userData} centers={centers} setCurCenter={setCurCenter} handleClear={handleClear}/>
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
                                                className = "p-2 text-center border-t-2 border-gray-500" 
                                                key={key}
                                                >
                                                <span className="underline text-lg">
                                                    {user.name}
                                                    <span className="no-underline text-sm">
                                                        ({user.wca_id})
                                                    </span>
                                                </span>
                                                <span className="absolute h-1/2 right-0 mr-2 hover: cursor-pointer" onClick={() => handleClick(user)}>+</span>
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
                <MapWithNoSSR center={curCenter} layers={layers}/>
            </div>
        </>
    )
}
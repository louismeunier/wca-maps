import { useEffect, useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import { countryCodes } from "@data/country-codes"
import { createPortal } from "react-dom"
import type { LatLngExpression } from "leaflet"
import { getCountry } from "@logic/geo-api"
import { SinglePersonStats } from "@components/Stats/SinglePersonStats"
import { ChevronDownIcon, ChevronUpIcon, CircleSlashIcon } from "@primer/octicons-react"

type propsTypes = {
    userData: userMetaData[]
    centers: LatLngExpression[],
    setCurCenter: Dispatch<SetStateAction<LatLngExpression>>,
    handleClear: any
}

export const LocationStats = (props: propsTypes):JSX.Element => {
    const [countries, setCountries] = useState<{ [key:string]: WCACompetition[] }[]|null>(null);
    const [countryCenter, setCountryCenter] = useState<string|null>(null);

    const [currentPage, setCurrentPage] = useState<number>(0);

    //Utility functions
    const codeToCountry = (code:string):string|undefined => {
        return countryCodes[code];
    }
    
    const latlngToCoordinate = (coordinate:LatLngExpression, decimals:number):string => {
        const coordinateArray:string[] = coordinate.toString().split(",");
        const lat:number = Number(Math.round(parseFloat(`${coordinateArray[0]}e${decimals}`))+`e-${decimals}`);
        const lng:number = Number(Math.round(parseFloat(`${coordinateArray[1]}e${decimals}`))+`e-${decimals}`);
        return `(${lat}, ${lng})`
    }

    //Effects
    useEffect(() => {
        console.log(props.userData)
        let res: { [key:string]: WCACompetition[] }[] = [{}]
        props.userData.forEach((user, index) => {
            user.competitions.forEach(competition => {
                if (!res[index]) res[index] = {}
                else if (res[index][competition.country_iso2]) res[index][competition.country_iso2].push(competition)
                else res[index][competition.country_iso2] = [competition]
            })
        })
        setCountries(res)
    }, [props])

    useEffect(() => {
        setCurrentPage(props.userData.length-1);
    }, [props.userData])
    // useEffect(() => {
    //     countries && getCountry(parseFloat(props.centers[currentPage].toString().split(",")[0]), parseFloat(props.centers[currentPage].toString().split(",")[1]))
    //         .then(res => {
    //             //have to handle error codes if, say, in the middle of the ocean
    //             if (res.status) {
    //                 setCountryCenter("No country found")
    //             } else {
    //                 setCountryCenter(res.countryName);
    //             }
    //             //alert(res.countryName)
    //         })
    //         .catch(err=>console.log("Failed to get country"))
    // },[countries])

    useEffect(() => {
        props.centers[currentPage] && props.setCurCenter(props.centers[currentPage]);
    },[currentPage])

    return (
        createPortal(
            countries?.length == props.userData.length &&
            <div className="absolute gap-2 grid grid-rows-3 grid-cols-5 mb-4 h-full max-w-full p-2 right-0 bottom-0 rounded-tl-xl bg-gray-400 border-gray-800 border-2 bg-opacity-80">
                <div className="grid gap-1 grid-rows-3 row-span-3">
                    <button disabled={currentPage==props.userData.length-1} className="bg-gray-500 bg-opacity-75 p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => {setCurrentPage(currentPage+1)}}>
                        <ChevronUpIcon size={48}/>
                    </button>
                    <button className="bg-gray-500 bg-opacity-75 p-2 rounded-xl" onClick={ props.handleClear }>
                        <CircleSlashIcon size={40}/>
                    </button>
                    <button disabled={currentPage==0} className="bg-gray-500 bg-opacity-75 p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => {setCurrentPage(currentPage-1)}}>
                        <ChevronDownIcon size={48}/>
                    </button>
                </div>
                {
                    props.centers[currentPage] && 
                    <SinglePersonStats user={props.userData[currentPage].user} countries={countries[currentPage]} center={props.centers[currentPage]}/>   
                }
            </div>,
            document.querySelector("#locationStats")!
        )
    )
}
import { useEffect, useState } from "react"
import { countryCodes } from "@data/country-codes"
import { createPortal } from "react-dom"
import { Profile } from "@components/Stats/Profile"
import type { LatLngExpression } from "leaflet"
import { getCountry } from "@logic/geo-api"

export const LocationStats = (props: { wcaData:WCAUser, locationData:WCACompetition[], center:LatLngExpression }):JSX.Element => {
    const [countries, setCountries] = useState<{ [key:string]: WCACompetition[] }|null>(null);
    const [countryCenter, setCountryCenter] = useState<string|null>(null);

    //Utility functions
    const StatHeader = (props: { header: string }):JSX.Element => { return <div className="underline grid place-items-center text-3xl font-bold italic">{props.header}</div> }

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
        let res: { [key:string]: WCACompetition[] } = {}
        props.locationData.forEach(competition => {
            if (res[competition.country_iso2]) res[competition.country_iso2].push(competition)
            else res[competition.country_iso2] = [competition]
        })
        setCountries(res)
    }, [])

    useEffect(() => {
        countries && getCountry(parseFloat(props.center.toString().split(",")[0]), parseFloat(props.center.toString().split(",")[1]))
            .then(res => {
                //have to handle error codes if, say, in the middle of the ocean
                if (res.status) {
                    setCountryCenter("No country found")
                } else {
                    setCountryCenter(res.countryName);
                }
                //alert(res.countryName)
            })
            .catch(err=>console.log("Failed to get country"))
    },[countries])

    return (
        createPortal(
            countries &&
            <div className="absolute gap-2 grid grid-cols-4 mb-4 h-full max-w-full p-2 right-0 bottom-0 rounded-tl-xl bg-gray-400 border-gray-800 border-2 bg-opacity-80">
                <StatHeader header="Person:"/>
                <Profile userInfo={props.wcaData}/>
                <div className="grid place-items-center">
                    <div className="h-1/5 text-center">
                        <StatHeader header="Countries:"/>
                        <h1>(top 3)</h1>
                    </div>
                </div>
                <div className="col-span-3 flex flex-row h-full flex-wrap justify-evenly content-center">
                    {
                        countries && Object.keys(countries)
                            .sort((a,b) => countries[b].length - countries[a].length)
                            .slice(0,3)
                            .map((country, key) => {
                                return (
                                    <div className="sticky grid h-1/3 place-items-center z-10" key={key}>
                                        <img className="h-full" src={`https://www.countryflags.io/${country.toLowerCase()}/flat/64.png`}/>
                                        <h1>{codeToCountry(country)}, {countries[country].length}</h1>
                                    </div>
                                )
                            })  
                    }
                </div>
                <StatHeader header="Other:"/>
                <div className="col-span-3 grid place-items-center">
                    <h1 className="text-center text-xl">Avg. Competition Coords: <em className="font-bold not-italic">{latlngToCoordinate(props.center, 3)}</em></h1>
                    <h2>{countryCenter ? countryCenter : "Calculating country..."}</h2>
                </div>
            </div>,
            document.querySelector("#locationStats")!
        )
    )
}
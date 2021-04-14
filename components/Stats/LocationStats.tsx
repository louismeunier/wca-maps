import { useEffect, useState } from "react"
import { countryCodes } from "@data/country-codes"
import { createPortal } from "react-dom"
import { Loading } from "@components/Loading"
import { Profile } from "@components/Stats/Profile"

export const LocationStats = (props: { wcaData:WCAUser, locationData:WCACompetition[] }):JSX.Element => {
    const [countries, setCountries] = useState<{ [key:string]: WCACompetition[] }|null>(null);

    const codeToCountry = (code:string):string|undefined => {
        return countryCodes[code];
    }
    
    useEffect(() => {
        let res: { [key:string]: WCACompetition[] } = {}
        props.locationData.forEach(competition => {
            if (res[competition.country_iso2]) res[competition.country_iso2].push(competition)
            else res[competition.country_iso2] = [competition]
        })
        setCountries(res)
    }, [])

    return (
        createPortal(
            <div className="absolute mb-4 h-full w-full p-2 right-0 bottom-0 rounded-tl-xl bg-gray-400 border-gray-800 border-2 bg-opacity-50">
                {
                    countries ? 
                    <>
                    <Profile userInfo={props.wcaData}/>
                    <div className="flex flex-row h-full flex-wrap justify-evenly content-center">
                        {
                            countries && Object.keys(countries)
                                .sort((a,b) => countries[b].length - countries[a].length)
                                .slice(0,3)
                                .map((country, key) => {
                                    return (
                                        <div className="sticky grid h-1/3 place-items-center z-10" key={key}>
                                            <h1>{codeToCountry(country)}, {countries[country].length}</h1>
                                            <img className="h-full" src={`https://www.countryflags.io/${country.toLowerCase()}/flat/64.png`}/>
                                        </div>
                                        )
                                    })  
                        }
                    </div>
                    </>
                    : <Loading/>
                }
            </div>,
            document.querySelector("#locationStats")!
        )
    )
}
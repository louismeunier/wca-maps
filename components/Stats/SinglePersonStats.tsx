import { countryCodes } from "@data/country-codes"
import { Profile } from "@components/Stats/Profile"
import type { LatLngExpression } from "leaflet"

export const SinglePersonStats = (props: {user: WCAUser, countries: { [key:string]: WCACompetition[] }, center: LatLngExpression}) => {
    const StatHeader = (props: { header: string }):JSX.Element => { return <div className="underline grid place-items-center text-3xl font-bold italic">{props.header}</div> }
    const latlngToCoordinate = (coordinate:LatLngExpression, decimals:number):string => {
        const coordinateArray:string[] = coordinate.toString().split(",");
        const lat:number = Number(Math.round(parseFloat(`${coordinateArray[0]}e${decimals}`))+`e-${decimals}`);
        const lng:number = Number(Math.round(parseFloat(`${coordinateArray[1]}e${decimals}`))+`e-${decimals}`);
        return `(${lat}, ${lng})`
    }
    const codeToCountry = (code:string):string|undefined => {
        return countryCodes[code];
    }

    return (
        <>
            <StatHeader header="Person:"/>
            <Profile userInfo={props.user}/>
            <div className="grid place-items-center">
                <div className="h-1/5 text-center">
                    <StatHeader header="Countries:"/>
                    <h1>(top 3)</h1>
                </div>
            </div>
            <div className="col-span-3 flex flex-row h-full flex-wrap justify-evenly content-center">
                {
                    props.countries && Object.keys(props.countries)
                        .sort((a,b) => props.countries[b].length - props.countries[a].length)
                        .slice(0,3)
                        .map((country, key) => {
                            return (
                                <div className="sticky grid h-1/3 place-items-center z-10" key={key}>
                                    <img 
                                    className="h-full" 
                                    src={`https://flagcdn.com/16x12/${country.toLowerCase()}.png`}
                                    ></img>
                                    <h1>{codeToCountry(country)}, {props.countries[country].length}</h1>
                                </div>
                            )
                        })  
                }
            </div>
            {/* Center is just always going to be the last added user's center rn */}
            <StatHeader header="Other:"/>
                <div className="col-span-3 grid place-items-center">
                <h1 className="text-center text-xl">Avg. Competition Coords: <em className="font-bold not-italic">Center</em></h1>
                <h2>{props.center && latlngToCoordinate(props.center,4)}</h2>
            </div>
        </>
        )
}
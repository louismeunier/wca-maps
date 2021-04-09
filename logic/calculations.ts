import { LatLngExpression } from "leaflet"

export const averageGeoPoint = (coordinates:number[][]):LatLngExpression => {
    console.log(coordinates)
    const toRadians = (degree:number):number => {return degree * (Math.PI/180)}
    const toDegrees = (radians:number):number => {return radians * (180/Math.PI)}

    const numCoordinates:number = coordinates.length;
    let xSum:number = 0;
    let ySum:number = 0;
    let zSum:number = 0;

    coordinates.forEach(coordinate => {
        xSum += (Math.cos(toRadians(coordinate[0])) * Math.cos(toRadians(coordinate[1])))
        ySum += (Math.cos(toRadians(coordinate[0])) * Math.sin(toRadians(coordinate[1])))
        zSum += Math.sin(toRadians(coordinate[0]))
    })

    const xAverageRadians:number = xSum/numCoordinates;
    const yAverageRadians:number = ySum/numCoordinates;
    const zAverageRadians:number = zSum/numCoordinates;

    const averageLongitude:number = toDegrees(Math.atan2(yAverageRadians, xAverageRadians));
    const hypotenuse:number = Math.sqrt(xAverageRadians*xAverageRadians + yAverageRadians*yAverageRadians);
    const averageLatitude:number = toDegrees(Math.atan2(zAverageRadians, hypotenuse));
    
    return [averageLatitude,averageLongitude]
}
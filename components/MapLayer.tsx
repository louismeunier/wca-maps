import { LatLngExpression, icon } from "leaflet";
import { Marker, Popup } from "react-leaflet";

export default function MapLayer(props: { position: LatLngExpression, message: string, notable?: boolean }):JSX.Element {
    const Icon = props.notable
        ? icon({
            iconUrl: "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
            iconSize: [60,60]
        })
        : icon({
            iconUrl: "https://www.freeiconspng.com/thumbs/address-icon/map-location-address-flat-icons--free-flat-icons--all-shapes--12.png",
            iconSize: [30,30]
        })
    return (
        <Marker 
            position={props.position} 
            draggable={false} 
            icon={Icon}
        >
            <Popup>
                <h1 className={props.notable ? "text-red-500" : "text-green-500"}>{props.message}</h1>
            </Popup>
        </Marker>
    )
}
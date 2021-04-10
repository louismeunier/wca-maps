import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getCountry } from "@logic/geo-api";
import type { LatLngExpression } from "leaflet";
import { useEffect } from "react";

const Map = (props: { layers: JSX.Element[], center: LatLngExpression }):JSX.Element => {
    const MapEvents = ():null => {
        useEffect(() => {
            map.setView(props.center)
        },[])
        const map = useMapEvents({
            // 'click': e => {
            //     alert(e.latlng)
            //     getCountry(e.latlng.lat, e.latlng.lng)
            //     .then(res=>alert(res.status ? "No country " : res.countryCode))
            // }
        })
        return null;
    }
    return (
        <MapContainer
            center={[0,0]}
            zoom={2}
            minZoom={2}
            scrollWheelZoom={true}
            zoomControl={false}
            className="h-full w-full z-0"
            >
            <MapEvents/>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* render layers as added by parent */}
            {props.layers.map(l=>l)}
        </MapContainer>
    );
};

export default Map;
import { MapContainer, Marker, TileLayer } from "react-leaflet";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

const Map = ({ coordinates }: { coordinates: Coordinates }) => {
  return (
    <div className="h-[740px] w-full">
      <MapContainer
        center={[coordinates.latitude, coordinates.longitude]}
        zoom={1}
        className="h-full w-screen"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={[coordinates.latitude, coordinates.longitude]}
        ></Marker>
      </MapContainer>
    </div>
  );
};

export default Map;

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ setCoords }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setCoords(e.latlng);
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function LocationMap({ onSelect }) {
  const [coords, setCoords] = useState(null);

  return (
    <div className="space-y-3">
      <MapContainer
        center={[20.1322288, 85.6216961]}
        zoom={12}
        style={{ height: "180px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker setCoords={setCoords} />
      </MapContainer>

    <button
  onClick={() => coords && onSelect(coords.lat, coords.lng)}
  className="
  w-full py-2
  bg-gradient-to-r from-blue-600  to-indigo-500
  text-white
  rounded-lg
  border border-indigo-300
  hover:shadow-[0_6px_20px_rgba(99,102,241,0.35)]
  hover:scale-[1.02]
  active:scale-[0.98]
  transition-all duration-200
  disabled:opacity-50
  cursor-pointer
  "
>
  Confirm Selected Location
</button>
    </div>
  );
}
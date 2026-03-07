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
        center={[20.2961, 85.8245]}
        zoom={13}
        style={{ height: "300px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker setCoords={setCoords} />
      </MapContainer>

      <button
        onClick={() => coords && onSelect(coords.lat, coords.lng)}
        className="w-full py-2 bg-gradient-to-r from-red-500 to-black/30 border border-red-500/40
              text-gray-300 rounded-lg cursor-pointer"
      >
        Confirm Selected Location
      </button>
    </div>
  );
}
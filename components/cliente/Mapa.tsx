"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FC } from "react";

// Corrige íconos rotos por defecto en Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Ubicacion {
  nombre: string;
  coordenadas: [number, number];
}

const ubicaciones: Ubicacion[] = [
  {
    nombre: "Sucursal Centro",
    coordenadas: [-32.07163107648337, -60.63650706035023],
  },
  {
    nombre: "Sucursal Av. Peron",
    coordenadas: [-32.06521231772683, -60.62153181660821],
  },
];

const Mapa: FC = () => {
  return (
    <div className="h-[320px] w-full overflow-hidden rounded-xl shadow-md sm:h-[420px] md:h-[500px]">
      <MapContainer
        center={[-32.07130923851953, -60.636502852664734]}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ubicaciones.map((ubicacion, idx) => (
          <Marker key={idx} position={ubicacion.coordenadas}>
            <Popup>{ubicacion.nombre}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Mapa;

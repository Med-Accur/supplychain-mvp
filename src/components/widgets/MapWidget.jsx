import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Exemple de données à récupérer via une API dans un useEffect ou query
const pointsCommandes = [
  { ville: 'Paris', lat: 48.8566, lng: 2.3522, nombre_commandes: 120, otif: 0.91 },
  { ville: 'Casablanca', lat: 33.5731, lng: -7.5898, nombre_commandes: 84, otif: 0.87 },
  { ville: 'Berlin', lat: 52.52, lng: 13.405, nombre_commandes: 45, otif: 0.78 },
]

export default function CarteCommandesClients() {
  return (
    <MapContainer center={[30, 0]} zoom={1.6} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pointsCommandes.map((point, i) => (
        <CircleMarker
          key={i}
          center={[point.lat, point.lng]}
          radius={Math.sqrt(point.nombre_commandes)} // taille dynamique
          color="blue"
          fillOpacity={0.6}
        >
          <Tooltip direction="top" offset={[0, -5]} opacity={1}>
            <div style={{ fontSize: '14px' }}>
              <b>{point.ville}</b><br />
              📦 Commandes : {point.nombre_commandes}<br />
              ✅ OTIF : {(point.otif * 100).toFixed(1)}%
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}

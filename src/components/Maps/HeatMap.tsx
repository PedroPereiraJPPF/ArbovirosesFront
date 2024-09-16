import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import L from 'leaflet';

interface HeatMapProps {
  data: [number, number, number][];
}

const HeatLayer: React.FC<{ data: [number, number, number][] }> = ({ data }) => {
  const map = useMap();

  React.useEffect(() => {
    const heatLayer = L.heatLayer(data, {
      radius: 25,
      blur: 15,
      gradient: {
        0.1: 'rgba(0, 255, 0, 0.1)',
        0.2: 'rgba(0, 255, 0, 0.2)',
        0.4: 'rgba(0, 255, 0, 0.3)',
        0.6: 'rgba(255, 255, 0, 0.4)',
        0.8: 'rgba(255, 0, 0, 0.7)',
        1.0: 'rgba(255, 0, 0, 0.8)',
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, data]);

  return null;
};

const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
  const bounds = L.latLngBounds(
    L.latLng(-5.205, -37.373), 
    L.latLng(-5.170, -37.315)
  );

  return (
    <MapContainer
      center={[-5.1878, -37.3442]} 
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
      scrollWheelZoom={true}
      dragging={true}
      boxZoom={true}
      doubleClickZoom={true}
      tap={true}
      maxBounds={bounds}              
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <HeatLayer data={data} />
    </MapContainer>
  );
};

export default HeatMap;

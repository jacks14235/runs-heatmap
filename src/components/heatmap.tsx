import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";

type LatLng = { lat: number; lng: number };

export function HeatMap() {
  const ll = (lat: number, lng: number) => ({ lat, lng });
  const [points, setPoints] = useState<LatLng[]>([]);
  useEffect(() => {}, []);
  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY || "" }}
      defaultCenter={ll(37.782, -122.435)}
      defaultZoom={10}
      style={{ width: "100%", height: "100%" }}
      heatmapLibrary={true}
      heatmap={{ positions: points, options: { radius: 20, opacity: 0.6 } }}
    >
      <Marker lat={59.955413} lng={30.337844} text="My Marker" />
    </GoogleMapReact>
  );
}

function Marker(props: { lat: number; lng: number; text: string }) {
  return <div />;
}

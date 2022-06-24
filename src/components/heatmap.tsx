import GoogleMapReact from "google-map-react";

export type LatLng = { lat: number; lng: number };

interface HeatMapProps {
  points: LatLng[],
  dissipating?: boolean,
  intensity: number
}
export function HeatMap(props: HeatMapProps) {
  const ll = (lat: number, lng: number) => ({ lat, lng });
  const options = { radius: 5, opacity: 1, maxIntensity: props.intensity}

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY || "" }}
      defaultCenter={ll(37.782, -122.435)}
      defaultZoom={3}
      style={{ width: "100%", height: "100%" }}
      heatmapLibrary={true}
      heatmap={{ positions: props.points, options: options }}
    >
      <Marker lat={59.955413} lng={30.337844} text="My Marker" />
    </GoogleMapReact>
  );
}

function Marker(props: { lat: number; lng: number; text: string }) {
  return <div />;
}

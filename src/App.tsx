import GoogleMapReact from 'google-map-react';
import { useEffect, useState } from 'react';

type LatLng = { lat: number, lng: number };

function App() {
  const ll = (lat: number, lng: number) => ({ lat, lng });
  const [points, setPoints] = useState<LatLng[]>([]);
  useEffect(() => {
    setPoints([
      ll(37.782, -122.447),
      ll(37.782, -122.445),
      ll(37.782, -122.443),
      ll(37.782, -122.441),
      ll(37.782, -122.439),
      ll(37.782, -122.437),
      ll(37.782, -122.435),
      ll(37.785, -122.447),
      ll(37.785, -122.445),
      ll(37.785, -122.443),
      ll(37.785, -122.441),
      ll(37.785, -122.439),
      ll(37.785, -122.437),
      ll(37.785, -122.435)
    ])
  }, []);

  return (
    <div className="">
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY || '' }}
        defaultCenter={ll(37.782, -122.435)}
        defaultZoom={11}
        heatmapLibrary={true}
        heatmap={{positions: points, options: {radius: 20, opacity: .6}}}
        ></GoogleMapReact>
    </div>
  );
}

export default App;

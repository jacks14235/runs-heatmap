import React, { useState, useEffect } from "react";
import { HeatMap, LatLng } from "./components/heatmap";
import { addData, getData } from "./logic/indexed-db-handler";
import { fromStrava, manyGPX } from "./logic/read-gpx";
import { getActivities, getToken } from "./logic/strava-requests";

function App() {
  const [points, setPoints] = useState<LatLng[]>([]);
  const [intensity, setIntensity] = useState<number>(500);
  useEffect(() => {
    retrieveFromDB();
  }, []);

  async function retrieveFromDB() {
    const data = await getData();
    const points: LatLng[] = [];
    for (let j = 0; j < data.length; j++) {
      for (let i = 0; i < data[j].data.length; i += 2) {
        points.push({
          lat: data[j].data[i] / 10_000_000,
          lng: data[j].data[i + 1] / 10_000_000,
        });
      }
    }
    console.log(points.length, "points loaded");
    setPoints(points);
  }

  useEffect(() => {
    const url = window.location.href;
    const map = getQueries(url);
    if (map.get("code") && map.get("scope")) {
      syncStravaData(map.get("code")!);
    }
  }, []);

  function syncStravaData(code: string) {
    getToken(code).then((token) => console.log(token));
  }

  function onFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) manyGPX(files).then(() => retrieveFromDB());
  }

  function testWrite() {
    addData("testfile", new Int32Array([1, 2, 3, 4, 5, 6, 7]));
  }

  return (
    <>
      <div style={{position:'absolute', top: 0, zIndex: 1000}}>
        <a
          href={`https://www.strava.com/oauth/authorize?client_id=${process.env.REACT_APP_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000&approval_prompt=force&scope=read,read_all,profile:read_all,activity:read,activity:read_all`}
        >
          <button>Connect with Strava</button>
        </a>
        <input
          type="file"
          multiple
          onChange={onFileUpload}
          style={{backgroundColor: 'darkviolet'}}
        />
        <input
          type="range"
          min="1"
          max="1000"
          onChange={(e) => setIntensity(Number(e.target.value))}
        />
      </div>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          bottom: "0",
        }}
      >
        <HeatMap points={points} intensity={intensity} />
      </div>
    </>
  );
}

function getQueries(url: string): Map<string, string> {
  const map = new Map<string, string>();
  url
    .substring(url.indexOf("?"))
    .split("&")
    .forEach((query) => {
      const eq = query.indexOf("=");
      map.set(query.substring(0, eq), query.substring(eq + 1));
    });
  return map;
}

export default App;

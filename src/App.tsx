import { useEffect } from "react";
import { getActivities, getToken } from "./logic/strava-requests";



function App() {

  useEffect(() => {
    const url = window.location.href;
    console.log(url)
    const map = getQueries(url);
    console.log(map);
    if (map.get('code') && map.get('scope')) {
      syncStravaData(map.get('code')!);
    }

  }, [])

  function syncStravaData(code: string) {
    getToken(code).then(token => console.log(token));
  }

  return (
    <div style={{width: '60%', height: '60%'}}>
      <a href={`https://www.strava.com/oauth/authorize?client_id=${process.env.REACT_APP_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000&approval_prompt=force&scope=read,read_all,profile:read_all,activity:read,activity:read_all`}>
        <button>Connect with Strava</button>
      </a>
      <button onClick={getActivities}>Get Activities</button>
    </div>
  );
}

function getQueries(url: string): Map<string, string> {
  const map = new Map<string, string>();
  url.substring(url.indexOf('?')).split('&').forEach(query => {
    const eq = query.indexOf('=');
    map.set(query.substring(0, eq), query.substring(eq + 1));
  });
  return map;
}

export default App;

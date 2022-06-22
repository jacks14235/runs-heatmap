import { rejects } from "assert";
import { resolve } from "path";

export function getToken(code: string) {
  return new Promise<string>((resolve, reject) => {
    const clientId = process.env.REACT_APP_STRAVA_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_STRAVA_CLIENT_SECRET;

    fetch(
      `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code`,
      {method: 'POST'}
    )
      .then((res) => res.json())
      .then((data) => {
          console.log(data);
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          localStorage.setItem('token_expiration', data.expires_at);
          localStorage.setItem('athlete', JSON.stringify(data.athlete));
          resolve(data.access_token);
      })
      .catch(err => reject(err));
  });
}
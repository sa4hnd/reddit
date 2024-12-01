const REDDIT_CLIENT_ID = "jHh4Fp1KNbW8Rmu6zB0kkQ";
const REDDIT_CLIENT_SECRET = "iX_oLI5FHpS0gyIj5MSyIH56_-TJvQ";
const REDIRECT_URI = "http://localhost:3000/callback";

export async function getRedditAuthUrl() {
  const state = Math.random().toString(36).substring(7);
  const scope = "identity privatemessages";

  return `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=code&state=${state}&redirect_uri=${REDIRECT_URI}&duration=permanent&scope=${scope}`;
}

export async function getRedditAccessToken(code: string) {
  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  return response.json();
} 
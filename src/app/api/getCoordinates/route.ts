import { NextResponse } from "next/server";

interface Cookie {
  fun_ticket: string;
  SESSION: string;
}

async function fetchWithErrorHandling(
  url: string | URL | Request,
  options: RequestInit | undefined
) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}

function getRandomChar(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

async function getGameData(gameId: string, cookie: Cookie) {
  const randomChar = getRandomChar();
  const url = `https://tuxun.fun/api/v0/tuxun/solo/get?gameId=${gameId}`;

  const gameData = await fetchWithErrorHandling(url, {
    method: "GET",
    headers: {
      "User-Agent": `Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0${randomChar}`,
      Accept: "application/json, text/plain, */*",
      Cookie: `fun_ticket=${cookie.fun_ticket}; SESSION=${cookie.SESSION}`,
    },
    credentials: "include",
    mode: "cors",
  });
  console.log("gameData: ", gameData);
  const rounds = gameData?.data?.rounds;
  if (!rounds || rounds.length === 0) {
    throw new Error("No rounds data found");
  }
  const targetRound = rounds[rounds.length - 1];
  console.log("targetRound: ", targetRound);
  return { panoId: targetRound.panoId, source: targetRound.source };
}

async function getGooglePanoData(panoId: any, cookie: Cookie) {
  const panoData = await fetchWithErrorHandling(
    "https://tuxun.fun/api/v0/tuxun/mapProxy/getGooglePanoInfoPost",
    {
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0",
        Accept: "*/*",
        "Content-Type": "application/json+protobuf",
        Cookie: `fun_ticket=${cookie.fun_ticket}; SESSION=${cookie.SESSION}`,
      },
      body: JSON.stringify([
        ["apiv3", null, null, null, "US", null, null, null, null, null, [[0]]],
        ["zh", "CN"],
        [[[1, panoId]]],
        [[]],
      ]),
      credentials: "include",
      mode: "cors",
    }
  );
  const panoCoordinates = panoData[1][0][5][0][1][0];
  return {
    latitude: panoCoordinates[2],
    longitude: panoCoordinates[3],
  };
}

async function getBaiduPanoData(panoId: any, cookie: Cookie) {
  const panoData = await fetchWithErrorHandling(
    `https://tuxun.fun/api/v0/tuxun/mapProxy/getPanoInfo?pano=${panoId}`,
    {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0",
        Accept: "*/*",
        "Content-Type": "application/json+protobuf",
        Cookie: `fun_ticket=${cookie.fun_ticket}; SESSION=${cookie.SESSION}`,
      },
    }
  );
  const panoCoordinates = panoData.data;
  return {
    latitude: panoCoordinates.lat,
    longitude: panoCoordinates.lng,
  };
}

export async function GET(req: any) {
  try {
    const gameId = req.nextUrl.searchParams.get("gameId");
    const fun_ticket = req.nextUrl.searchParams
      .get("fun_ticket")
      ?.replace(/ /g, "+");
    const SESSION = req.nextUrl.searchParams.get("SESSION");
    console.log(`${gameId}--${fun_ticket.toString()}--${SESSION}`);
    const { panoId, source } = await getGameData(gameId, {
      fun_ticket,
      SESSION,
    });
    console.log("Last round panoId:", panoId);
    const getPanoData =
      source === "baidu_pano" ? getBaiduPanoData : getGooglePanoData;

    const { latitude, longitude } = await getPanoData(panoId, {
      fun_ticket,
      SESSION,
    });
    console.log("Latitude:", latitude, "Longitude:", longitude);

    return NextResponse.json({ latitude, longitude });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

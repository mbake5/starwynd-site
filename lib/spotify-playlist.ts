const PLAYLIST_ID = "78oYJUxVuPHAAt7FJaLrZv";

export type FeaturedTrack = {
  id: string;
  title: string;
  artist: string;
  url: string;
  artworkUrl: string | null;
};

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export async function getFeaturedTracks(): Promise<FeaturedTrack[]> {
  const playlistUrl = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;

  try {
    const response = await fetch(playlistUrl, {
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Spotify playlist request failed: ${response.status}`
      );
    }

    const html = await response.text();

    /*
     * Spotify's public playlist page currently renders track rows
     * with data-testid="track-row".
     */

    const rowRegex =
      /<div\b[^>]*data-testid="track-row"[^>]*>[\s\S]*?(?=<div\b[^>]*data-testid="track-row"|<\/body>)/g;

    const rows = [...html.matchAll(rowRegex)]
      .map((match) => match[0])
      .slice(0, 3);

    const tracks: FeaturedTrack[] = [];

    for (const row of rows) {
      const idMatch = row.match(
        /(?:href="\/track\/|spotify:track:)([A-Za-z0-9]+)/
      );

      if (!idMatch) {
        continue;
      }

      const id = idMatch[1];

      const titleMatch = row.match(
        /<span[^>]*class="[^"]*line-clamp[^"]*"[^>]*>(.*?)<\/span>/
      );

      const ariaLabelMatch = row.match(
        /data-testid="track-row"[^>]*aria-label="([^"]+)"/
      );

      const artworkMatch = row.match(
        /src="(https:\/\/i\.scdn\.co\/image\/[^"]+)"/
      );

      const title = decodeHtmlEntities(
        titleMatch?.[1] ||
          ariaLabelMatch?.[1] ||
          "Featured Track"
      );

      const artworkUrl = artworkMatch?.[1]
        ? artworkMatch[1].replace(
            "ab67616d00004851",
            "ab67616d0000b273"
          )
        : null;

      tracks.push({
        id,
        title,
        artist: "Starwynd",
        url: `https://open.spotify.com/track/${id}`,
        artworkUrl,
      });
    }

    /*
     * Fallback if Spotify changes the track-row markup.
     */

    if (tracks.length < 3) {
      const fallbackIds = [
        ...html.matchAll(
          /spotify:track:([A-Za-z0-9]+)/g
        ),
      ]
        .map((match) => match[1])
        .filter(
          (id, index, array) =>
            array.indexOf(id) === index
        )
        .slice(0, 3);

      for (const id of fallbackIds) {
        if (tracks.some((track) => track.id === id)) {
          continue;
        }

        tracks.push({
          id,
          title: "Featured Track",
          artist: "Starwynd",
          url: `https://open.spotify.com/track/${id}`,
          artworkUrl: null,
        });
      }
    }

    return tracks.slice(0, 3);
  } catch (error) {
    console.error("Unable to read Spotify playlist:", error);
    return [];
  }
}
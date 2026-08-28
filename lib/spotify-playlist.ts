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

async function getTrackMetadata(
  id: string,
  playlistRow: string
): Promise<FeaturedTrack> {
  const url = `https://open.spotify.com/track/${id}`;

  let title = "Featured Track";
  let artist = "Starwynd";
  let artworkUrl: string | null = null;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 300,
      },
    });

    if (response.ok) {
      const html = await response.text();

      const ogTitleMatch = html.match(
        /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i
      );

      const ogImageMatch = html.match(
        /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i
      );

      const ogDescriptionMatch = html.match(
        /<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i
      );

      if (ogTitleMatch?.[1]) {
        title = decodeHtmlEntities(ogTitleMatch[1]);
      }

      if (ogImageMatch?.[1]) {
        artworkUrl = ogImageMatch[1];
      }

      if (ogDescriptionMatch?.[1]) {
        const description = decodeHtmlEntities(ogDescriptionMatch[1]);

        const artistMatch = description.match(
          /(?:Song|Track)\s+by\s+(.+?)(?:\s+\||$)/i
        );

        if (artistMatch?.[1]) {
          artist = artistMatch[1].trim();
        }
      }
    }
  } catch (error) {
    console.error(`Spotify track metadata error for ${id}:`, error);
  }

  if (!artworkUrl) {
    const artworkMatch = playlistRow.match(
      /src="(https:\/\/i\.scdn\.co\/image\/[^"]+)"/
    );

    if (artworkMatch?.[1]) {
      artworkUrl = artworkMatch[1].replace(
        "ab67616d00004851",
        "ab67616d0000b273"
      );
    }
  }

  if (artist === "Starwynd") {
    /*
     * Avoid the ES2018-only /s regex flag.
     * [\s\S] matches across line breaks.
     */
    const artistMatch = playlistRow.match(
      /href="\/artist\/[^"]+"[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/
    );

    if (artistMatch?.[1]) {
      const possibleArtist = decodeHtmlEntities(
        artistMatch[1].replace(/<[^>]+>/g, "").trim()
      );

      if (possibleArtist) {
        artist = possibleArtist;
      }
    }
  }

  return {
    id,
    title,
    artist,
    url,
    artworkUrl,
  };
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
     *
     * [\s\S] is used instead of the ES2018 /s regex flag so the
     * project can build with its current TypeScript target.
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

      const track = await getTrackMetadata(id, row);

      if (track.title === "Featured Track") {
        const titleMatch = row.match(
          /<span[^>]*class="[^"]*line-clamp[^"]*"[^>]*>(.*?)<\/span>/
        );

        const ariaLabelMatch = row.match(
          /data-testid="track-row"[^>]*aria-label="([^"]+)"/
        );

        track.title = decodeHtmlEntities(
          titleMatch?.[1] ||
            ariaLabelMatch?.[1] ||
            "Featured Track"
        );
      }

      tracks.push(track);
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
import { parseUploads, type ChannelVideo } from "./youtube-rotation";

const uploadsUrl = "https://www.youtube.com/playlist?list=UUpCI4H8FllHtTgq3MDB9Y5w&hl=en";

// Verified public uploads, retained if YouTube is temporarily unavailable.
const fallbackVideos: ChannelVideo[] = [
  { id: "BMxMnKqk-jw", title: "You Wanted The Night" },
  { id: "K-FLQtkhaAw", title: "Open To The Wind" },
  { id: "mnabjIZ8Gr0", title: "Where The Light Stays" },
  { id: "o1qf7AZjcSQ", title: "Electric Daydream" },
];
let lastKnownVideos = fallbackVideos;

export async function getChannelVideos(): Promise<ChannelVideo[]> {
  try {
    const response = await fetch(uploadsUrl, {
      next: { revalidate: 3600 }, signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`YouTube uploads: ${response.status}`);
    const html = await response.text();
    const match = html.match(/var ytInitialData = ([\s\S]*?);<\/script>/);
    if (!match) throw new Error("YouTube uploads data missing");
    const initial = JSON.parse(match[1]);
    let page = parseUploads(initial.contents);
    const videos = new Map(page.videos.map((video) => [video.id, video]));
    const clientVersion = html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)?.[1];
    const seenTokens = new Set<string>();
    // Follow the public uploads listing's continuation, rather than limiting the
    // pool to YouTube's short recent-uploads feed or the first page of results.
    while (page.continuation) {
      if (!clientVersion || seenTokens.has(page.continuation) || seenTokens.size >= 100) {
        throw new Error("Could not finish the YouTube uploads listing");
      }
      seenTokens.add(page.continuation);
      const more = await fetch("https://www.youtube.com/youtubei/v1/browse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: { client: { clientName: "WEB", clientVersion, hl: "en", gl: "US" } },
          continuation: page.continuation,
        }),
        next: { revalidate: 3600 }, signal: AbortSignal.timeout(10000),
      });
      if (!more.ok) throw new Error(`YouTube continuation: ${more.status}`);
      page = parseUploads(await more.json());
      for (const video of page.videos) videos.set(video.id, video);
    }
    if (!videos.size) throw new Error("YouTube returned an empty uploads listing");
    lastKnownVideos = [...videos.values()];
    return lastKnownVideos;
  } catch (error) {
    console.warn("Using saved YouTube rotation:", error instanceof Error ? error.message : error);
    return lastKnownVideos;
  }
}

export type ChannelVideo = { id: string; title: string };

export function centralDay(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((value) => value.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function dailyVideo(videos: ChannelVideo[], day: string): ChannelVideo {
  if (!videos.length) throw new Error("No videos available for rotation");
  // A stable order means every public upload gets a turn before the cycle repeats.
  const ordered = [...videos].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const dayNumber = Math.floor(Date.parse(`${day}T00:00:00Z`) / 86400000);
  if (!Number.isFinite(dayNumber)) throw new Error("Invalid rotation date");
  return ordered[((dayNumber % ordered.length) + ordered.length) % ordered.length];
}

type JsonRecord = Record<string, unknown>;
function record(value: unknown): JsonRecord {
  return value && typeof value === "object" ? value as JsonRecord : {};
}
function text(value: unknown): string {
  const data = record(value);
  if (typeof data.simpleText === "string") return data.simpleText;
  if (typeof data.content === "string") return data.content;
  return Array.isArray(data.runs)
    ? data.runs.map((run) => record(run).text ?? "").join("") : "";
}

export function parseUploads(data: unknown): { videos: ChannelVideo[]; continuation?: string } {
  const videos = new Map<string, ChannelVideo>();
  let continuation: string | undefined;
  function add(id: unknown, title: string) {
    if (typeof id === "string" && /^[A-Za-z0-9_-]{11}$/.test(id) && title.trim()
      && !["[Private video]", "[Deleted video]"].includes(title)) {
      videos.set(id, { id, title: title.trim() });
    }
  }
  function walk(value: unknown) {
    if (!value || typeof value !== "object") return;
    const node = record(value);
    if (node.lockupViewModel) {
      const row = record(node.lockupViewModel);
      if (row.contentType === "LOCKUP_CONTENT_TYPE_VIDEO") {
        add(row.contentId, text(record(record(row.metadata).lockupMetadataViewModel).title));
      }
      return;
    }
    if (node.playlistVideoRenderer) {
      const row = record(node.playlistVideoRenderer);
      if (row.isPlayable !== false) add(row.videoId, text(row.title));
      return;
    }
    if (node.continuationItemRenderer) {
      const endpoint = record(record(node.continuationItemRenderer).continuationEndpoint);
      const token = record(endpoint.continuationCommand).token;
      if (typeof token === "string") continuation = token;
      return;
    }
    for (const child of Object.values(node)) walk(child);
  }
  walk(data);
  return { videos: [...videos.values()], continuation };
}

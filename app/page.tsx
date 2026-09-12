import Experience from "./experience";
import { getFeaturedTracks } from "../lib/spotify-playlist";
import { getChannelVideos } from "../lib/youtube-channel";
import { centralDay } from "../lib/youtube-rotation";

export const revalidate = 300;
export default async function Home() {
  const [tracks, videos] = await Promise.all([getFeaturedTracks(), getChannelVideos()]);
  return <Experience tracks={tracks} videos={videos} videoDay={centralDay()} />;
}

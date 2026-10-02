import Redesign from "./redesign/redesign";
import { getFeaturedTracks } from "../lib/spotify-playlist";
import { getChannelVideos } from "../lib/youtube-channel";
import { centralDay } from "../lib/youtube-rotation";

export const revalidate = 300;
export default async function Home() {
  const [tracks, videos] = await Promise.all([getFeaturedTracks(), getChannelVideos()]);
  return <Redesign tracks={tracks} videos={videos} videoDay={centralDay()} />;
}

import type { Metadata } from "next";
import Redesign from "./redesign";
import { getFeaturedTracks } from "../../lib/spotify-playlist";
import { getChannelVideos } from "../../lib/youtube-channel";
import { centralDay } from "../../lib/youtube-rotation";

// Preview of the proposed redesign, kept out of search results until it
// replaces the home page.
export const metadata: Metadata = {
  title: "Redesign preview",
  robots: { index: false, follow: false },
};

export const revalidate = 300;

export default async function RedesignPage() {
  const [tracks, videos] = await Promise.all([getFeaturedTracks(), getChannelVideos()]);
  return <Redesign tracks={tracks} videos={videos} videoDay={centralDay()} />;
}

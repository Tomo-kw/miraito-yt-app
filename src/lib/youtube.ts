export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
}

export async function getChannelVideos(
  channelId: string,
  maxResults: number = 15
): Promise<YouTubeVideo[]> {
  try {
    const url = `/api/youtube?channelId=${channelId}&maxResults=${maxResults}`;

    console.log("Fetching videos from API route:", url);

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const videos: YouTubeVideo[] = await response.json();

    console.log(`Successfully received ${videos.length} videos`);

    return videos;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    throw error;
  }
}

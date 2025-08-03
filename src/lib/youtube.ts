export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
}

export interface YouTubeResponse {
  videos: YouTubeVideo[];
  nextPageToken?: string;
}

export async function getChannelVideos(
  channelId: string,
  maxResults: number = 15,
  pageToken?: string
): Promise<YouTubeResponse> {
  try {
    let url = `/api/youtube?channelId=${channelId}&maxResults=${maxResults}`;

    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }

    console.log("Fetching videos from API route:", url);

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data: YouTubeResponse = await response.json();

    console.log(`Successfully received ${data.videos.length} videos`);

    return data;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    throw error;
  }
}

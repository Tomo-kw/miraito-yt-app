import { NextRequest, NextResponse } from "next/server";

interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    publishedAt: string;
    channelTitle: string;
  };
}

interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
  nextPageToken?: string;
}

interface YouTubeVideoItem {
  id: string;
  contentDetails: {
    duration: string;
  };
  snippet: {
    liveBroadcastContent: string;
  };
  liveStreamingDetails?: {
    actualEndTime?: string;
  };
}

interface YouTubeVideosResponse {
  items: YouTubeVideoItem[];
}

// ISO 8601 duration文字列を秒数に変換
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get("channelId");
    const maxResults = searchParams.get("maxResults") || "15";
    const pageToken = searchParams.get("pageToken") || "";

    if (!channelId) {
      return NextResponse.json(
        { error: "Channel ID is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      console.error("YouTube API key is not configured");
      return NextResponse.json(
        { error: "YouTube API key is not configured" },
        { status: 500 }
      );
    }

    // Step 1: Search for videos
    let searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&type=video&maxResults=${maxResults}`;

    if (pageToken) {
      searchUrl += `&pageToken=${pageToken}`;
    }

    console.log("Fetching from YouTube API (search):", {
      channelId,
      maxResults,
      pageToken,
    });

    const searchResponse = await fetch(searchUrl);

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error(
        "YouTube API search error:",
        searchResponse.status,
        errorText
      );
      return NextResponse.json(
        { error: `YouTube API error: ${searchResponse.status}` },
        { status: searchResponse.status }
      );
    }

    const searchData: YouTubeSearchResponse = await searchResponse.json();

    // Step 2: Get video details for duration and live broadcast info
    const videoIds = searchData.items.map((item) => item.id.videoId).join(",");
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=contentDetails,snippet,liveStreamingDetails`;

    console.log("Fetching video details for duration and live info:", {
      videoIds,
    });

    const videosResponse = await fetch(videosUrl);

    if (!videosResponse.ok) {
      const errorText = await videosResponse.text();
      console.error(
        "YouTube API videos error:",
        videosResponse.status,
        errorText
      );
      return NextResponse.json(
        { error: `YouTube API videos error: ${videosResponse.status}` },
        { status: videosResponse.status }
      );
    }

    const videosData: YouTubeVideosResponse = await videosResponse.json();

    // Step 3: Combine data and determine video types
    const videos = searchData.items.map((searchItem: YouTubeSearchItem) => {
      const videoDetails = videosData.items.find(
        (video) => video.id === searchItem.id.videoId
      );

      let isShort = false;
      let isLiveArchive = false;
      let durationSeconds = 0;

      if (videoDetails) {
        // Parse duration and check if it's a Short (≤60 seconds)
        durationSeconds = parseDuration(videoDetails.contentDetails.duration);
        isShort = durationSeconds <= 60 && durationSeconds > 0;

        // ライブアーカイブ判定: liveStreamingDetails.actualEndTimeが存在する
        isLiveArchive = !!(
          videoDetails.liveStreamingDetails &&
          videoDetails.liveStreamingDetails.actualEndTime
        );
      }

      return {
        id: searchItem.id.videoId,
        title: searchItem.snippet.title,
        thumbnail: searchItem.snippet.thumbnails.medium.url,
        publishedAt: searchItem.snippet.publishedAt,
        channelTitle: searchItem.snippet.channelTitle,
        isShort,
        isLiveArchive,
        durationSeconds,
      };
    });

    console.log(`Successfully fetched ${videos.length} videos with metadata`);

    return NextResponse.json(
      {
        videos,
        nextPageToken: searchData.nextPageToken,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Error in YouTube API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

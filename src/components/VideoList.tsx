"use client";

import {
  Box,
  Grid,
  Text,
  Image,
  VStack,
  HStack,
  Link,
  Skeleton,
} from "@chakra-ui/react";
import { FiExternalLink, FiCalendar } from "react-icons/fi";
import { YouTubeVideo } from "@/lib/youtube";

interface VideoListProps {
  videos: YouTubeVideo[];
  isLoading?: boolean;
  lastVideoElementRef?: (node: HTMLDivElement) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function VideoCard({
  video,
  isLast,
  lastVideoElementRef,
}: {
  video: YouTubeVideo;
  isLast?: boolean;
  lastVideoElementRef?: (node: HTMLDivElement) => void;
}) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <Box ref={isLast ? lastVideoElementRef : null}>
      <Link
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        _hover={{ textDecoration: "none" }}
        display="block"
      >
        <Box
          borderWidth="1px"
          borderColor="gray.700"
          borderRadius="xl"
          overflow="hidden"
          bg="gray.800"
          shadow="lg"
          _hover={{
            shadow: "2xl",
            transform: "translateY(-4px)",
            borderColor: "yellow.400",
          }}
          transition="all 0.3s ease"
          h="full"
        >
          {/* サムネイル */}
          <Box position="relative">
            <Image
              src={video.thumbnail}
              alt={video.title}
              w="full"
              h="200px"
              objectFit="cover"
            />
            <Box
              position="absolute"
              top={3}
              right={3}
              bg="blackAlpha.800"
              color="yellow.400"
              p={2}
              borderRadius="full"
              fontSize="sm"
              _hover={{
                bg: "yellow.400",
                color: "gray.900",
              }}
              transition="all 0.2s ease"
            >
              <FiExternalLink />
            </Box>

            {/* Gradient Overlay */}
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              h="20px"
              bgGradient="linear(to-t, gray.800, transparent)"
            />
          </Box>

          {/* 動画情報 */}
          <VStack align="start" p={5} gap={3}>
            <Text
              fontSize="md"
              fontWeight="semibold"
              lineHeight="1.4"
              color="white"
              css={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              _hover={{
                color: "yellow.400",
              }}
              transition="color 0.2s ease"
            >
              {video.title}
            </Text>

            <HStack gap={2} color="gray.400" fontSize="sm">
              <FiCalendar size={14} />
              <Text>{formatDate(video.publishedAt)}</Text>
            </HStack>
          </VStack>
        </Box>
      </Link>
    </Box>
  );
}

export default function VideoList({
  videos,
  isLoading,
  lastVideoElementRef,
}: VideoListProps) {
  if (isLoading) {
    return (
      <VStack gap={6} w="full">
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={8}
          w="full"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Box key={index} bg="gray.800" borderRadius="xl" overflow="hidden">
              <Skeleton height="200px" />
              <VStack align="start" p={5} gap={3}>
                <Skeleton height="20px" width="90%" />
                <Skeleton height="20px" width="70%" />
                <Skeleton height="16px" width="60%" />
              </VStack>
            </Box>
          ))}
        </Grid>
      </VStack>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <VStack gap={6} py={12}>
        <Box
          p={8}
          bg="gray.800"
          borderRadius="xl"
          borderWidth="2px"
          borderColor="gray.700"
          borderStyle="dashed"
        >
          <VStack gap={4}>
            <Text fontSize="xl" color="gray.400" fontWeight="medium">
              動画が見つかりませんでした
            </Text>
            <Text fontSize="sm" color="gray.500">
              しばらく時間をおいてから再度お試しください
            </Text>
          </VStack>
        </Box>
      </VStack>
    );
  }

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        md: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
      }}
      gap={8}
      w="full"
    >
      {videos.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          isLast={index === videos.length - 1}
          lastVideoElementRef={lastVideoElementRef}
        />
      ))}
    </Grid>
  );
}

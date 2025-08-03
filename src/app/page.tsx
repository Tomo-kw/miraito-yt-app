"use client";

import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Image,
  Button,
  Separator,
  Heading,
  Spinner,
  useBreakpointValue,
  Flex,
  Input,
} from "@chakra-ui/react";
import { FiDownload, FiShare, FiSearch, FiChevronDown } from "react-icons/fi";
import { useEffect, useState, useCallback, useRef } from "react";
import VideoList from "@/components/VideoList";
import { YouTubeVideo, getChannelVideos } from "@/lib/youtube";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const MIRAITO_CHANNEL_ID = "UCPI9u6wLr0APIZxNAB7o8qw";

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installable, setInstallable] = useState(false);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // レスポンシブ値
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  const headerTextAlign = useBreakpointValue({ base: "center", lg: "left" }) as
    | "center"
    | "left";
  const logoSize = useBreakpointValue({ base: 16, lg: 20 });
  const titleSize = useBreakpointValue({ base: "2xl", lg: "4xl" });
  const subtitleSize = useBreakpointValue({ base: "sm", lg: "lg" });

  const loadMoreVideos = useCallback(async () => {
    if (!nextPageToken || loadingMore) return;

    try {
      setLoadingMore(true);
      const response = await getChannelVideos(
        MIRAITO_CHANNEL_ID,
        15,
        nextPageToken
      );

      setVideos((prev) => [...prev, ...response.videos]);
      setNextPageToken(response.nextPageToken);
      setHasMore(!!response.nextPageToken);
    } catch (error) {
      console.error("Failed to load more videos:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [nextPageToken, loadingMore]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastVideoElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreVideos();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, loadMoreVideos]
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const initializeVideos = async () => {
      try {
        setVideosLoading(true);
        const response = await getChannelVideos(MIRAITO_CHANNEL_ID, 30);
        setVideos(response.videos);
        setNextPageToken(response.nextPageToken);
        setHasMore(!!response.nextPageToken);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setVideosLoading(false);
      }
    };

    void initializeVideos();
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setInstallable(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Miraito App",
          text: "Check out this amazing PWA!",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    }
  };

  // 検索フィルタ済み動画リスト
  const filteredVideos =
    searchQuery.trim() === ""
      ? videos
      : videos.filter((video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // 追加取得処理
  const handleLoadMore = async () => {
    if (!nextPageToken || loadingMore) return;
    try {
      setLoadingMore(true);
      const response = await getChannelVideos(
        MIRAITO_CHANNEL_ID,
        30,
        nextPageToken
      );
      setVideos((prev) => [...prev, ...response.videos]);
      setNextPageToken(response.nextPageToken);
      setHasMore(!!response.nextPageToken);
    } catch (error) {
      console.error("Failed to load more videos:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.900" color="white">
      <Container maxW="container.xl" py={8}>
        <VStack gap={12} align="center">
          {/* Header with Logo and App Name - Responsive Layout */}
          <Box w="full" pt={8}>
            {isLargeScreen ? (
              // Large screen layout (horizontal)
              <Flex w="full" justify="space-between" align="center" gap={6}>
                {/* Logo + App Name */}
                <HStack gap={6} align="center">
                  <Image
                    src="/icons/icon-192x192.png"
                    alt="Miraito App Icon"
                    w={logoSize}
                    h={logoSize}
                    borderRadius="2xl"
                    shadow="2xl"
                    border="3px solid"
                    borderColor="yellow.400"
                  />
                  <VStack gap={2} align="start">
                    <Heading
                      as="h1"
                      fontSize={titleSize}
                      fontWeight="bold"
                      color="white"
                      textShadow="2px 2px 4px rgba(0,0,0,0.5)"
                    >
                      Miraito Channel
                    </Heading>
                    <Text
                      fontSize={subtitleSize}
                      color="yellow.400"
                      fontWeight="medium"
                    >
                      未来を照らすコンテンツをお届け
                    </Text>
                  </VStack>
                </HStack>

                {/* Action Buttons */}
                <HStack gap={4}>
                  {installable && (
                    <Button
                      bg="yellow.400"
                      color="gray.900"
                      size="lg"
                      borderRadius="full"
                      fontWeight="bold"
                      onClick={handleInstallClick}
                      shadow="lg"
                      _hover={{
                        bg: "yellow.300",
                        transform: "translateY(-2px)",
                        shadow: "xl",
                      }}
                      transition="all 0.3s ease"
                      px={8}
                    >
                      <FiDownload />
                      <Text ml={2}>アプリをインストール</Text>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    borderColor="yellow.400"
                    color="yellow.400"
                    size="lg"
                    borderRadius="full"
                    fontWeight="bold"
                    onClick={handleShare}
                    _hover={{
                      bg: "yellow.400",
                      color: "gray.900",
                      transform: "translateY(-2px)",
                      shadow: "lg",
                    }}
                    transition="all 0.3s ease"
                    px={8}
                  >
                    <FiShare />
                    <Text ml={2}>シェア</Text>
                  </Button>
                </HStack>
              </Flex>
            ) : (
              // Small screen layout (vertical)
              <VStack gap={6} align="center">
                {/* Logo + App Name */}
                <HStack gap={4} align="center">
                  <Image
                    src="/icons/icon-192x192.png"
                    alt="Miraito App Icon"
                    w={logoSize}
                    h={logoSize}
                    borderRadius="2xl"
                    shadow="2xl"
                    border="3px solid"
                    borderColor="yellow.400"
                  />
                  <VStack gap={1} align="start">
                    <Heading
                      as="h1"
                      fontSize={titleSize}
                      fontWeight="bold"
                      color="white"
                      textShadow="2px 2px 4px rgba(0,0,0,0.5)"
                    >
                      Miraito Channel
                    </Heading>
                    <Text
                      fontSize={subtitleSize}
                      color="yellow.400"
                      fontWeight="medium"
                    >
                      未来を照らすコンテンツをお届け
                    </Text>
                  </VStack>
                </HStack>

                {/* Action Buttons */}
                <HStack gap={4}>
                  {installable && (
                    <Button
                      bg="yellow.400"
                      color="gray.900"
                      size="lg"
                      borderRadius="full"
                      fontWeight="bold"
                      onClick={handleInstallClick}
                      shadow="lg"
                      _hover={{
                        bg: "yellow.300",
                        transform: "translateY(-2px)",
                        shadow: "xl",
                      }}
                      transition="all 0.3s ease"
                      px={8}
                    >
                      <FiDownload />
                      <Text ml={2}>アプリをインストール</Text>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    borderColor="yellow.400"
                    color="yellow.400"
                    size="lg"
                    borderRadius="full"
                    fontWeight="bold"
                    onClick={handleShare}
                    _hover={{
                      bg: "yellow.400",
                      color: "gray.900",
                      transform: "translateY(-2px)",
                      shadow: "lg",
                    }}
                    transition="all 0.3s ease"
                    px={8}
                  >
                    <FiShare />
                    <Text ml={2}>シェア</Text>
                  </Button>
                </HStack>
              </VStack>
            )}

            {/* Description */}
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="gray.300"
              maxW="2xl"
              textAlign={headerTextAlign}
              lineHeight="1.6"
              mt={6}
            >
              最新のYouTube動画をチェックして、新しい学びと発見を見つけましょう。
            </Text>
          </Box>

          {/* Elegant Separator */}
          <Box w="full" maxW="md" position="relative">
            <Separator borderColor="gray.700" borderWidth="2px" />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="gray.900"
              px={4}
            >
              <Box w={3} h={3} bg="yellow.400" borderRadius="full" />
            </Box>
          </Box>

          {/* Videos Section */}
          <Box w="full">
            {/* Videos Section Header */}
            <VStack gap={4} mb={8}>
              <Heading
                as="h2"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                color="white"
                textAlign="center"
                textShadow="2px 2px 4px rgba(0,0,0,0.5)"
              >
                <Text as="span" color="yellow.400">
                  Miraito
                </Text>
                チャンネル最新動画
              </Heading>
              <Text fontSize="md" color="gray.400" textAlign="center">
                最新{videos.length > 0 ? videos.length : ""}
                本の動画をお楽しみください
              </Text>
              {/* 検索ボックス */}
              <HStack w="full" maxW="md" gap={2} mt={2}>
                <Box color="yellow.400" pl={3} pt={1}>
                  <FiSearch />
                </Box>
                <Input
                  placeholder="動画タイトルで検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  bg="gray.800"
                  color="white"
                  borderColor="yellow.400"
                  _placeholder={{ color: "gray.400" }}
                  borderRadius="full"
                  size="lg"
                />
              </HStack>
              {/* 検索注記 */}
              <Text
                fontSize="xs"
                color="gray.400"
                textAlign="left"
                w="full"
                maxW="md"
                pl={8}
              >
                ※現在表示中の動画のみ検索対象です
              </Text>
            </VStack>

            {/* 検索結果が0件の場合の表示 */}
            {filteredVideos.length === 0 && !videosLoading && (
              <VStack gap={6} py={12}>
                <Text fontSize="xl" color="gray.400" fontWeight="medium">
                  該当する動画がありません
                </Text>
              </VStack>
            )}

            <VideoList videos={filteredVideos} isLoading={videosLoading} />

            {/* 続きを見るボタン */}
            {hasMore && filteredVideos.length > 0 && !videosLoading && (
              <VStack py={8}>
                <Button
                  onClick={handleLoadMore}
                  bg="yellow.400"
                  color="gray.900"
                  borderRadius="full"
                  fontWeight="bold"
                  size="lg"
                  px={8}
                  shadow="lg"
                  _hover={{
                    bg: "yellow.300",
                    transform: "translateY(-2px)",
                    shadow: "xl",
                  }}
                  transition="all 0.3s ease"
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <HStack gap={2}>
                      <Spinner size="sm" color="gray.900" />
                      <span>読み込み中...</span>
                    </HStack>
                  ) : (
                    <HStack gap={2}>
                      <FiChevronDown />
                      <span>続きを見る</span>
                    </HStack>
                  )}
                </Button>
              </VStack>
            )}

            {/* Loading More Indicator */}
            {loadingMore && (
              <VStack gap={4} py={8}>
                <Spinner size="lg" color="yellow.400" />
                <Text color="gray.400" fontSize="sm">
                  さらに動画を読み込み中...
                </Text>
              </VStack>
            )}

            {/* End of List Message */}
            {!hasMore && videos.length > 0 && (
              <VStack gap={4} py={8}>
                <Text color="gray.500" fontSize="sm" textAlign="center">
                  すべての動画を表示しました
                </Text>
              </VStack>
            )}
          </Box>

          {/* Footer */}
          <Box
            w="full"
            textAlign="center"
            pt={12}
            borderTop="1px solid"
            borderColor="gray.700"
            mt={8}
          >
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
              Powered by{" "}
              <Text as="span" color="yellow.400">
                Next.js 15
              </Text>
              {" + "}
              <Text as="span" color="yellow.400">
                Chakra UI v3
              </Text>
              {" + "}
              <Text as="span" color="yellow.400">
                YouTube Data API
              </Text>
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

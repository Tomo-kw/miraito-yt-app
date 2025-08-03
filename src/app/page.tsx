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
} from "@chakra-ui/react";
import { FiDownload, FiShare } from "react-icons/fi";
import { useEffect, useState } from "react";
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
    async function fetchVideos() {
      try {
        setVideosLoading(true);
        const channelVideos = await getChannelVideos(MIRAITO_CHANNEL_ID, 15);
        setVideos(channelVideos);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setVideosLoading(false);
      }
    }

    fetchVideos();
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

  return (
    <Box minH="100vh" bg="gray.900" color="white">
      <Container maxW="container.xl" py={8}>
        <VStack gap={12} align="center">
          {/* Header with Logo and App Name */}
          <VStack gap={6} textAlign="center" pt={8}>
            {/* Logo + App Name Header */}
            <HStack gap={4} align="center">
              <Image
                src="/icons/icon-192x192.png"
                alt="Miraito App Icon"
                w={16}
                h={16}
                borderRadius="2xl"
                shadow="2xl"
                border="3px solid"
                borderColor="yellow.400"
              />
              <VStack gap={1} align="start">
                <Heading
                  as="h1"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="bold"
                  color="white"
                  textShadow="2px 2px 4px rgba(0,0,0,0.5)"
                >
                  Miraito Channel
                </Heading>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="yellow.400"
                  fontWeight="medium"
                >
                  未来を照らすコンテンツをお届け
                </Text>
              </VStack>
            </HStack>

            {/* Description */}
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="gray.300"
              maxW="md"
              textAlign="center"
              lineHeight="1.6"
            >
              最新のYouTube動画をチェックして、新しい学びと発見を見つけましょう。
            </Text>

            {/* Action Buttons */}
            <HStack gap={4} pt={6}>
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
            </VStack>

            <VideoList videos={videos} isLoading={videosLoading} />
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

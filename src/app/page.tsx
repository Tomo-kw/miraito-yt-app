"use client";

import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Image,
  Button,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { FiDownload, FiShare, FiSmartphone } from "react-icons/fi";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installable, setInstallable] = useState(false);

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
    <Container maxW="container.md" py={8}>
      <VStack gap={8} align="center" h="100vh" justify="center">
        {/* Header */}
        <Flex
          w="full"
          justify="space-between"
          align="center"
          position="absolute"
          top={4}
          left={0}
          right={0}
          px={8}
        >
          <Badge colorPalette="blue" px={3} py={1} borderRadius="full">
            PWA Ready
          </Badge>
        </Flex>

        {/* Main content */}
        <VStack gap={6} textAlign="center">
          {/* App Icon */}
          <Box>
            <Image
              src="/icons/icon-192x192.png"
              alt="Miraito App Icon"
              w={24}
              h={24}
              borderRadius="3xl"
              shadow="xl"
            />
          </Box>

          {/* Title and description */}
          <VStack gap={4}>
            <Text
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="bold"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              Miraito
            </Text>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.600"
              maxW="md"
            >
              未来を照らすPWAアプリケーション。モダンなウェブ技術で作られた次世代のアプリ体験をお楽しみください。
            </Text>
          </VStack>

          {/* Action buttons */}
          <HStack gap={4} pt={4}>
            {installable && (
              <Button
                colorPalette="blue"
                size="lg"
                onClick={handleInstallClick}
                shadow="lg"
              >
                <FiDownload />
                アプリをインストール
              </Button>
            )}

            <Button variant="outline" size="lg" onClick={handleShare}>
              <FiShare />
              シェア
            </Button>
          </HStack>

          {/* Features */}
          <VStack gap={4} pt={8}>
            <Text fontSize="lg" fontWeight="semibold" color="gray.700">
              主な機能
            </Text>
            <HStack gap={8} wrap="wrap" justify="center">
              <VStack gap={2}>
                <FiSmartphone size={32} color="#3182CE" />
                <Text fontSize="sm" fontWeight="medium">
                  モバイル対応
                </Text>
              </VStack>
              <VStack gap={2}>
                <FiDownload size={32} color="#38A169" />
                <Text fontSize="sm" fontWeight="medium">
                  オフライン利用
                </Text>
              </VStack>
              <VStack gap={2}>
                <FiShare size={32} color="#805AD5" />
                <Text fontSize="sm" fontWeight="medium">
                  簡単シェア
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </VStack>

        {/* Footer */}
        <Text
          fontSize="sm"
          color="gray.500"
          position="absolute"
          bottom={4}
          textAlign="center"
        >
          Powered by Next.js 15 + Chakra UI v3
        </Text>
      </VStack>
    </Container>
  );
}

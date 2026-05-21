/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT: any;
  }
}

interface YouTubePlayerProps {
  videoId: string | null;
  embedUrl: string;
  title: string;
  className?: string;
  autoplay?: boolean;
}

export default function YouTubePlayer({
  videoId,
  embedUrl,
  title,
  className = "w-full h-full absolute top-0 left-0",
  autoplay = false,
}: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // If not a YouTube video (e.g. TikTok, other formats), pause background music immediately on mount
    if (!videoId) {
      window.dispatchEvent(new Event("pause-bg-music"));
      return () => {
        window.dispatchEvent(new Event("play-bg-music"));
      };
    }

    let player: any = null;
    let isDestroyed = false;

    const loadYoutubeAPI = () => {
      if (window.YT && window.YT.Player) {
        return;
      }
      const existingTag = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existingTag) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }
      }
    };

    const initPlayer = () => {
      if (isDestroyed || !containerRef.current || !window.YT || !window.YT.Player) return;

      // Create a unique element ID for the player container
      const tempId = `yt-player-${Math.random().toString(36).substring(2, 9)}`;
      const placeholder = document.createElement("div");
      placeholder.id = tempId;
      placeholder.className = "w-full h-full";
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(placeholder);

      player = new window.YT.Player(tempId, {
        videoId: videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          rel: 0,
          enablejsapi: 1,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              window.dispatchEvent(new Event("pause-bg-music"));
            } else if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              window.dispatchEvent(new Event("play-bg-music"));
            }
          },
        },
      });

      playerRef.current = player;
    };

    const checkAPI = () => {
      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        setTimeout(checkAPI, 100);
      }
    };

    loadYoutubeAPI();
    checkAPI();

    return () => {
      isDestroyed = true;
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
      }
      window.dispatchEvent(new Event("play-bg-music"));
    };
  }, [videoId, autoplay]);

  // Fallback for non-YouTube videos (e.g. TikTok, other URLs)
  if (!videoId) {
    return (
      <iframe
        src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=${autoplay ? 1 : 0}&rel=0`}
        title={title}
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  return <div ref={containerRef} className={className} />;
}

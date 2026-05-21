"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: any;
    bgPlayerInstance?: any;
  }
}

export default function BackgroundMusic() {
  const playerRef = useRef<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Fallback: If autoplay is blocked by the browser, play on first user interaction (any click)
    const handleUserGesturePlay = () => {
      const activePlayer = playerRef.current || window.bgPlayerInstance;
      if (activePlayer && typeof activePlayer.playVideo === "function") {
        activePlayer.playVideo();
      }
    };

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      // Crucial: Clean up any pre-existing player instance to prevent duplicate audio streams
      if (window.bgPlayerInstance) {
        try {
          window.bgPlayerInstance.destroy();
        } catch (e) {
          console.warn("Error destroying previous player instance:", e);
        }
        window.bgPlayerInstance = null;
      }

      // Clear the container to avoid double iframe injection
      const playerContainer = document.getElementById("youtube-player");
      if (playerContainer) {
        playerContainer.innerHTML = "";
      }

      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: "pXnjIbYVLk0",
        playerVars: {
          autoplay: 1, // Autoplay enabled
          controls: 0, // Hide controls
          disablekb: 1,
          fs: 0,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          loop: 1,
          playlist: "pXnjIbYVLk0", // Required for looping
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(45); // Set sensible background volume
            event.target.playVideo(); // Try playing immediately
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              // Successfully playing, can remove click fallback
              document.removeEventListener("click", handleUserGesturePlay);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo(); // Loop song
            }
          },
        },
      });

      // Save to global window to track state across hot-reloads and strict mode remounts
      window.bgPlayerInstance = playerRef.current;
    };

    // Load YouTube API script
    const loadYoutubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initPlayer();
        return;
      }

      // Check if script tag is already there
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

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    };

    const channel = typeof window !== "undefined" ? new BroadcastChannel("sadaham_naukawa_music") : null;

    const handlePauseMusic = () => {
      const activePlayer = playerRef.current || window.bgPlayerInstance;
      if (activePlayer && typeof activePlayer.pauseVideo === "function") {
        activePlayer.pauseVideo();
      }
    };

    const handlePlayMusic = () => {
      const activePlayer = playerRef.current || window.bgPlayerInstance;
      if (activePlayer && typeof activePlayer.playVideo === "function") {
        activePlayer.playVideo();
      }
    };

    const handlePauseMusicFromEvent = () => {
      handlePauseMusic();
      if (channel) {
        channel.postMessage("pause");
      }
    };

    const handlePlayMusicFromEvent = () => {
      handlePlayMusic();
      if (channel) {
        channel.postMessage("play");
      }
    };

    if (channel) {
      channel.onmessage = (event) => {
        if (event.data === "pause") {
          handlePauseMusic();
        } else if (event.data === "play") {
          handlePlayMusic();
        }
      };
    }

    document.addEventListener("click", handleUserGesturePlay);
    window.addEventListener("pause-bg-music", handlePauseMusicFromEvent);
    window.addEventListener("play-bg-music", handlePlayMusicFromEvent);

    if (pathname === "/") {
      loadYoutubeAPI();
    }

    return () => {
      // Clean up player on unmount / hot-reload to stop the audio immediately
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
        playerRef.current = null;
      }
      if (window.bgPlayerInstance) {
        try {
          window.bgPlayerInstance.destroy();
        } catch (e) {
          // ignore
        }
        window.bgPlayerInstance = null;
      }
      if (window.onYouTubeIframeAPIReady) {
        delete window.onYouTubeIframeAPIReady;
      }
      document.removeEventListener("click", handleUserGesturePlay);
      window.removeEventListener("pause-bg-music", handlePauseMusicFromEvent);
      window.removeEventListener("play-bg-music", handlePlayMusicFromEvent);
      if (channel) {
        channel.close();
      }
    };
  }, [pathname]);

  return (
    <div className="absolute top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none opacity-0 select-none" aria-hidden="true">
      <div id="youtube-player"></div>
    </div>
  );
}

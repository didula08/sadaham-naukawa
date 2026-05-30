/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import TikTokEmbed from "@/components/TikTokEmbed";

import { getTikTokId, isTikTokUrl } from "@/lib/tiktok";
import { resolveTikTokShortUrl } from "@/actions/lanternActions";

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

  // State to handle resolving shortened TikTok URLs on the fly
  const [resolvedTikTokId, setResolvedTikTokId] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    // If not a YouTube video (e.g. TikTok, other formats), pause background music immediately on mount
    if (!videoId) {
      window.dispatchEvent(new Event("pause-bg-music"));
      
      // If it's a TikTok URL but we don't have the ID yet (e.g. short link like vt.tiktok.com)
      // we need to resolve it on the server to get the full URL and extract the ID.
      if (isTikTokUrl(embedUrl)) {
        const initialId = getTikTokId(embedUrl);
        if (initialId) {
          setResolvedTikTokId(initialId);
        } else {
          setIsResolving(true);
          resolveTikTokShortUrl(embedUrl).then((fullUrl) => {
            const extractedId = getTikTokId(fullUrl);
            if (extractedId) {
              setResolvedTikTokId(extractedId);
            }
            setIsResolving(false);
          });
        }
      }

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
          vq: 'hd1080',
          modestbranding: 1,
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

  // Fallback for non-YouTube videos
  if (!videoId) {
    if (resolvedTikTokId) {
      return <TikTokEmbed videoId={resolvedTikTokId} className={className} />;
    }

    if (isTikTokUrl(embedUrl)) {
      if (isResolving) {
        return (
          <div className={`flex flex-col items-center justify-center bg-black/90 text-white p-6 text-center border border-white/10 rounded-xl ${className}`}>
             <div className="w-12 h-12 mb-4 border-4 border-[#00f2fe] border-t-[#fe2c55] rounded-full animate-spin"></div>
             <p className="text-sm text-gray-300 font-semibold animate-pulse">Loading TikTok Video...</p>
          </div>
        );
      }

      // If it's a TikTok URL but we couldn't extract an ID even after resolving, show fallback button
      return (
        <div className={`flex flex-col items-center justify-center bg-black/90 text-white p-6 text-center border border-white/10 rounded-xl ${className}`}>
          <div className="w-12 h-12 mb-3 bg-black rounded-xl border border-white/20 flex items-center justify-center overflow-hidden">
             <span className="text-xl font-bold text-white drop-shadow-[2px_2px_0px_#00f2fe] [-webkit-text-stroke:1px_#fe2c55]">d</span>
          </div>
          <p className="text-sm text-gray-300 mb-4 font-semibold">Cannot preview this TikTok link format directly.</p>
          <a href={embedUrl} target="_blank" rel="noopener noreferrer" className="bg-[#fe2c55] hover:bg-[#e0264b] text-white px-6 py-2.5 rounded-full font-bold transition-colors shadow-lg hover:shadow-[#fe2c55]/50 flex items-center gap-2 text-sm">
            Watch on TikTok &rarr;
          </a>
        </div>
      );
    }

    // Generic iframe fallback for any other non-YouTube URL
    return (
      <iframe
        src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=${autoplay ? 1 : 0}&rel=0`}
        title={title}
        className={className}
        style={{ border: 'none', background: '#000' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  return <div ref={containerRef} className={className} />;
}

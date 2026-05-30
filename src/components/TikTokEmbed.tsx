'use client';

import { useEffect, useRef } from 'react';

interface TikTokEmbedProps {
  videoId: string;
  className?: string;
}

/**
 * Embeds a TikTok video using TikTok's official embed.js approach.
 * A plain <iframe src="embed/v2/..."> gets redirected to the main TikTok
 * page by TikTok's server (which then hits its frame-ancestors CSP block).
 * The only way to properly embed TikTok is via their embed.js script, which
 * transforms a <blockquote> into their authenticated player iframe.
 */
export default function TikTokEmbed({ videoId, className = '' }: TikTokEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any previous embed
    container.innerHTML = '';

    // Build the blockquote element that TikTok's embed.js expects
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'tiktok-embed';
    blockquote.setAttribute('cite', `https://www.tiktok.com/video/${videoId}`);
    blockquote.setAttribute('data-video-id', videoId);
    blockquote.style.cssText =
      'max-width:100%;min-width:0;border:0;padding:0;margin:0 auto;';
    const section = document.createElement('section');
    blockquote.appendChild(section);
    container.appendChild(blockquote);

    // Remove any stale embed.js script so TikTok re-scans and initialises
    const existing = document.getElementById('tiktok-embed-js');
    if (existing) existing.parentNode?.removeChild(existing);

    const script = document.createElement('script');
    script.id = 'tiktok-embed-js';
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [videoId]);

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center w-full h-full overflow-auto ${className}`}
    />
  );
}

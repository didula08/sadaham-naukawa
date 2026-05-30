/**
 * Extracts the TikTok numeric video ID from various TikTok URL formats.
 * E.g., https://www.tiktok.com/@username/video/7123456789012345678 -> 7123456789012345678
 *
 * Use the returned ID with TikTok's official embed endpoint:
 *   https://www.tiktok.com/embed/v2/{id}
 * (This is the only URL format that TikTok allows to be framed on third-party sites)
 */
export function getTikTokId(url: string): string | null {
  if (!url) return null;
  
  // Matches:
  // - tiktok.com/@user/video/123456789
  // - tiktok.com/v/123456789
  // - tiktok.com/embed/v2/123456789
  // - tiktok.com/player/v1/123456789
  try {
    const decodedUrl = decodeURIComponent(url);
    const match = decodedUrl.match(/(?:tiktok\.com\/(?:@[^\/]+\/video\/|v\/|embed\/v2\/|player\/v1\/))(\d+)/i);
    if (match) return match[1];
  } catch (e) {
    // If decoding fails, fallback to original
    const match = url.match(/(?:tiktok\.com\/(?:(?:@|%40)[^\/]+\/video\/|v\/|embed\/v2\/|player\/v1\/))(\d+)/i);
    if (match) return match[1];
  }

  // ULTRA PERMISSIVE FALLBACK
  // If we know it's a TikTok URL but structural matching failed (due to malformed
  // encoding, missing '@', or other unexpected mutations), simply extract the
  // first sequence of 15+ digits. TikTok video IDs are strictly 19 digits.
  if (/tiktok\.com/i.test(url)) {
    const fallbackMatch = url.match(/(\d{15,})/);
    if (fallbackMatch) {
      return fallbackMatch[1];
    }
  }

  return null;
}

/**
 * Checks if the given URL is a TikTok URL.
 */
export function isTikTokUrl(url: string): boolean {
  if (!url) return false;
  return /tiktok\.com/i.test(url);
}

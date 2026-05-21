/**
 * Extracts the 11-character YouTube video ID from various YouTube URL formats
 * (including desktop, mobile, embed, shorts, and shortened youtu.be links).
 */
export function getYoutubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}

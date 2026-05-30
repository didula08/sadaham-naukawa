/**
 * Extracts the video URL and converts it to the proper Facebook Embed URL.
 * Facebook videos must be embedded using their official plugins/video.php endpoint.
 */

export function isFacebookUrl(url: string): boolean {
  if (!url) return false;
  return /facebook\.com|fb\.watch|fb\.video/i.test(url);
}

export async function resolveFacebookShareUrl(url: string): Promise<string> {
  if (url.includes('/share/v/') || url.includes('fb.watch')) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      const finalUrl = res.url;
      // Extract the canonical part before the query string
      const canonicalMatch = finalUrl.match(/^(https?:\/\/[^\/]+\/[^\/]+\/videos\/\d+\/)/);
      if (canonicalMatch && canonicalMatch[1]) {
        return canonicalMatch[1].replace('web.facebook.com', 'www.facebook.com');
      }
      return finalUrl.split('?')[0].replace('web.facebook.com', 'www.facebook.com');
    } catch (e) {
      return url;
    }
  }
  return url;
}

export function getFacebookEmbedUrl(url: string): string | null {
  if (!isFacebookUrl(url)) return null;

  if (url.includes('/plugins/video.php')) {
    return url;
  }

  // For Facebook embeds, we use their official plugin endpoint and pass the URL
  // We need to encode the original URL
  try {
    const encodedUrl = encodeURIComponent(url);
    return `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false`;
  } catch (e) {
    return null;
  }
}

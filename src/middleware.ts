import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting state (in-memory for simple implementation, normally use Redis)
// NOTE: Vercel/Serverless environments may lose this state, but it's better than nothing
const ipRequestCount = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number, windowMs: number, keySuffix: string): boolean {
  const now = Date.now();
  const cacheKey = `${ip}:${keySuffix}`;
  const limitData = ipRequestCount.get(cacheKey);

  if (!limitData || now > limitData.resetTime) {
    ipRequestCount.set(cacheKey, { count: 1, resetTime: now + windowMs });
    return true; // Allowed
  }

  if (limitData.count >= limit) {
    return false; // Blocked
  }

  limitData.count++;
  return true; // Allowed
}

export function middleware(request: NextRequest) {
  const ip = (request as any).ip || request.headers.get('x-forwarded-for') || 'unknown';
  const { pathname, hostname } = request.nextUrl;

  if (request.method === 'POST') {
    const isDev = process.env.NODE_ENV === 'development' || hostname === 'localhost' || hostname === '127.0.0.1';
    
    // Only apply rate limiting in production to avoid distracting local developers/testing
    if (!isDev) {
      // 1. Admin login/actions: strict (5 attempts per minute)
      if (pathname.startsWith('/sadahamnaukawaadmin') || pathname.startsWith('/api/admin')) {
        if (!checkRateLimit(ip, 5, 60 * 1000, 'admin')) {
          return new NextResponse(
            JSON.stringify({ error: 'Too many attempts. Please try again after a minute.' }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
          );
        }
      } 
      // 2. Public POST requests (likes, submissions): moderate (50 attempts per minute)
      else {
        if (!checkRateLimit(ip, 50, 60 * 1000, 'public')) {
          return new NextResponse(
            JSON.stringify({ error: 'Too many requests. Please try again later.' }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (audio, images, 3D models)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav|ogg|glb|gltf)).*)',
  ],
};


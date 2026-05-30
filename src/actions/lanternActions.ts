'use server';

import { revalidatePath } from 'next/cache';
import { headers, cookies } from 'next/headers';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import xss from 'xss';
import connectToDatabase from '@/lib/mongodb';
import { Lantern } from '@/models/Lantern';
import { Like } from '@/models/Like';
import { getTikTokId } from '@/lib/tiktok';
import { getFacebookEmbedUrl, resolveFacebookShareUrl } from '@/lib/facebook';

export async function resolveTikTokShortUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return res.url;
  } catch (e) {
    return url;
  }
}

export async function addLantern(formData: FormData) {
  try {
    await connectToDatabase();

    const creatorName = formData.get('creatorName') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const videoUrl = formData.get('videoUrl') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;

    if (
      !creatorName ||
      !title ||
      !description ||
      !videoUrl ||
      !phone ||
      !email ||
      !address
    ) {
      return { error: 'සියලුම තොරතුරු ඇතුළත් කරන්න (Please fill all fields)' };
    }

    // Strict input length validation to prevent Denial of Service via large payloads
    if (creatorName.length > 100) return { error: 'නම වැඩියි (Name too long. Max 100 characters)' };
    if (title.length > 100) return { error: 'මාතෘකාව වැඩියි (Title too long. Max 100 characters)' };
    if (description.length > 1000) return { error: 'විස්තරය වැඩියි (Description too long. Max 1000 characters)' };
    if (address.length > 500) return { error: 'ලිපිනය වැඩියි (Address too long. Max 500 characters)' };

    // Format verification for Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 100) {
      return { error: 'වලංගු විද්‍යුත් තැපෑලක් ඇතුළත් කරන්න (Please enter a valid email address)' };
    }

    // Format verification for Phone
    const phoneRegex = /^[+0-9\s-]{8,20}$/;
    if (!phoneRegex.test(phone)) {
      return { error: 'වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න (Please enter a valid phone number)' };
    }

    // Validate video URL domain & protocol to prevent arbitrary iframe embedding / javascript: XSS
    let sanitizedVideoUrl = videoUrl.trim();
    try {
      const parsedUrl = new URL(sanitizedVideoUrl);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return { error: 'වලංගු වීඩියෝ සබැඳියක් ඇතුළත් කරන්න (Invalid video URL protocol)' };
      }
      
      const hostname = parsedUrl.hostname.toLowerCase();
      const allowedDomains = [
        'youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be',
        'tiktok.com', 'www.tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com', 'm.tiktok.com',
        'facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.watch', 'fb.video'
      ];
      const isAllowedDomain = allowedDomains.some(domain => hostname === domain || hostname.endsWith('.' + domain));
      
      if (!isAllowedDomain) {
        return { error: 'යූටියුබ්, ටික්ටොක් හෝ ෆේස්බුක් සබැඳියක් පමණක් ඇතුළත් කරන්න (Please enter only YouTube, TikTok, or Facebook video links)' };
      }
    } catch (_) {
      return { error: 'වලංගු වීඩියෝ සබැඳියක් ඇතුළත් කරන්න (Invalid video URL)' };
    }

    // YouTube/TikTok/Facebook embedding extraction
    const ytMatch = sanitizedVideoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch && ytMatch[1]) {
      sanitizedVideoUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    } else {
      const ttId = getTikTokId(sanitizedVideoUrl);
      if (ttId) {
        sanitizedVideoUrl = `https://www.tiktok.com/embed/v2/${ttId}`;
      } else {
        const resolvedFbUrl = await resolveFacebookShareUrl(sanitizedVideoUrl);
        const fbEmbedUrl = getFacebookEmbedUrl(resolvedFbUrl);
        if (fbEmbedUrl) {
          sanitizedVideoUrl = fbEmbedUrl;
        }
      }
    }

    // Sanitize user inputs using xss to prevent Stored XSS
    const cleanCreatorName = xss(creatorName.trim());
    const cleanTitle = xss(title.trim());
    const cleanDescription = xss(description.trim());
    const cleanPhone = xss(phone.trim());
    const cleanEmail = xss(email.trim());
    const cleanAddress = xss(address.trim());

    const newLantern = new Lantern({
      creatorName: cleanCreatorName,
      title: cleanTitle,
      description: cleanDescription,
      videoUrl: sanitizedVideoUrl,
      phone: cleanPhone,
      email: cleanEmail,
      address: cleanAddress,
      isApproved: false,
      isWinner: false,
    });

    await newLantern.save();
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Error adding lantern:', error);
    return { error: 'නිර්මාණය ඇතුළත් කිරීමේදී දෝෂයක් ඇතිවිය (Error submitting)' };
  }
}

export async function likeLantern(lanternId: string) {
  try {
    await connectToDatabase();

    // Get IP address to prevent multiple likes
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const voterIp = forwardedFor ? forwardedFor.split(',')[0] : 'unknown-ip';

    // Check if already liked
    const existingLike = await Like.findOne({ lanternId, voterIp });
    if (existingLike) {
      return { error: 'ඔබ දැනටමත් මනාපය පළකර ඇත (You have already liked this)' };
    }

    // Use a transaction if possible, but for simple setups we can just increment
    // Since this is a simple MongoDB setup, we'll do an atomic findOneAndUpdate
    const updatedLantern = await Lantern.findByIdAndUpdate(
      lanternId,
      { $inc: { likeCount: 1 } },
      { new: true }
    );

    if (!updatedLantern) {
      return { error: 'නිර්මාණය සොයාගත නොහැක (Lantern not found)' };
    }

    await Like.create({ lanternId, voterIp });

    revalidatePath('/', 'layout');
    return { success: true, likeCount: updatedLantern.likeCount };
  } catch (error: any) {
    console.error('Error liking lantern:', error);
    return { error: 'මනාපය පළකිරීමේදී දෝෂයක් ඇතිවිය (Error liking)' };
  }
}

export async function getAllLanterns() {
  try {
    await connectToDatabase();
    // Only return approved items to the general public, selecting only safe fields (exclude bank/receipt info)
    const lanterns = await Lantern.find({ isApproved: true })
      .select('_id title description videoUrl creatorName likeCount isApproved isWinner createdAt')
      .sort({ likeCount: -1, createdAt: -1 })
      .lean();
    
    return JSON.parse(JSON.stringify(lanterns));
  } catch (error) {
    console.error('Error fetching lanterns:', error);
    return [];
  }
}

export async function getWinnerLantern() {
  try {
    await connectToDatabase();
    // Select only safe fields for public winner details
    const winner = await Lantern.findOne({ isWinner: true })
      .select('_id title description videoUrl creatorName likeCount isApproved isWinner createdAt')
      .lean();
    return winner ? JSON.parse(JSON.stringify(winner)) : null;
  } catch (error) {
    console.error('Error fetching winner:', error);
    return null;
  }
}

/* ==========================================================================
   ADMIN ACTIONS
   ========================================================================== */

function getAdminPassword(): string {
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass) {
    throw new Error('ADMIN_PASSWORD environment variable is not configured');
  }
  return adminPass;
}

function getJwtSecret(): string {
  return process.env.JWT_SECRET || getAdminPassword();
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as any;
    return !!(decoded && decoded.role === 'admin');
  } catch (err) {
    return false;
  }
}

export async function checkAdminAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');
  if (!sessionCookie || !(await verifyAdminToken(sessionCookie.value))) {
    throw new Error('Unauthorized');
  }
  return true;
}

// Helper to compare passwords in constant time to prevent timing attacks
function timingSafeCompare(password: string, adminPass: string): boolean {
  const aHash = crypto.createHash('sha256').update(password).digest();
  const bHash = crypto.createHash('sha256').update(adminPass).digest();
  const isMatch = crypto.timingSafeEqual(aHash, bHash);
  return isMatch && password.length === adminPass.length;
}

export async function loginAdmin(password: string) {
  try {
    const adminPass = getAdminPassword();
    if (timingSafeCompare(password, adminPass)) {
      const token = jwt.sign({ role: 'admin' }, getJwtSecret(), { expiresIn: '1d' });
      const cookieStore = await cookies();
      cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });
      return { success: true };
    }
    return { error: 'වැරදි මුරපදයක් (Incorrect passcode)' };
  } catch (error: any) {
    console.error('Admin authentication error:', error);
    return { error: error.message || 'පද්ධති දෝෂයක් (System configuration error)' };
  }
}

export async function logoutAdmin() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    return { success: true };
  } catch (error) {
    return { error: 'Logout failed' };
  }
}

// Kept for backward compatibility if needed, though loginAdmin should be used
export async function verifyAdminPassword(password: string) {
  try {
    const adminPass = getAdminPassword();
    if (timingSafeCompare(password, adminPass)) {
      return { success: true };
    }
    return { error: 'වැරදි මුරපදයක් (Incorrect passcode)' };
  } catch (error: any) {
    console.error('Admin authentication error:', error);
    return { error: error.message || 'පද්ධති දෝෂයක් (System configuration error)' };
  }
}

export async function getAdminLanterns() {
  await checkAdminAuth();

  try {
    await connectToDatabase();
    const lanterns = await Lantern.find()
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(lanterns));
  } catch (error) {
    console.error('Error fetching admin lanterns:', error);
    return [];
  }
}

export async function approveLantern(id: string) {
  try {
    await checkAdminAuth();

    await connectToDatabase();
    const updated = await Lantern.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    if (!updated) return { error: 'නිර්මාණය සොයාගත නොහැක (Lantern not found)' };
    
    revalidatePath('/');
    revalidatePath('/', 'page');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Error approving lantern:', error);
    return { error: error.message || 'අනුමත කිරීමේදී දෝෂයක් සිදු විය (Error approving)' };
  }
}

export async function rejectLantern(id: string) {
  try {
    await checkAdminAuth();

    await connectToDatabase();
    const deleted = await Lantern.findByIdAndDelete(id);
    if (!deleted) return { error: 'නිර්මාණය සොයාගත නොහැක (Lantern not found)' };
    
    revalidatePath('/');
    revalidatePath('/', 'page');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting lantern:', error);
    return { error: error.message || 'ප්‍රතික්ෂේප කිරීමේදී දෝෂයක් සිදු විය (Error rejecting)' };
  }
}

export async function selectWinner(id: string) {
  try {
    await checkAdminAuth();

    await connectToDatabase();
    // Reset previous winner
    await Lantern.updateMany({}, { isWinner: false });
    // Set this one as winner and automatically approve it if not already
    const updated = await Lantern.findByIdAndUpdate(id, { isWinner: true, isApproved: true }, { new: true });
    if (!updated) return { error: 'නිර්මාණය සොයාගත නොහැක (Lantern not found)' };

    revalidatePath('/');
    revalidatePath('/', 'page');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Error selecting winner:', error);
    return { error: error.message || 'ජයග්‍රාහකයා තේරීමේදී දෝෂයක් සිදු විය (Error selecting winner)' };
  }
}

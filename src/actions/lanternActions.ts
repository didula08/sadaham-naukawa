'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import { Lantern } from '@/models/Lantern';
import { Like } from '@/models/Like';

export async function addLantern(formData: FormData) {
  try {
    await connectToDatabase();

    const creatorName = formData.get('creatorName') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    let videoUrl = formData.get('videoUrl') as string;
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

    // Basic sanitization/extraction for YouTube URLs
    let sanitizedVideoUrl = videoUrl;
    const ytMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch && ytMatch[1]) {
      sanitizedVideoUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    const newLantern = new Lantern({
      creatorName,
      title,
      description,
      videoUrl: sanitizedVideoUrl,
      phone,
      email,
      address,
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
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_PASSWORD environment variable is not configured');
    }
    return 'admin123'; // dev fallback
  }
  return adminPass;
}

export async function verifyAdminPassword(password: string) {
  try {
    const adminPass = getAdminPassword();
    if (password === adminPass) {
      return { success: true };
    }
    return { error: 'වැරදි මුරපදයක් (Incorrect passcode)' };
  } catch (error: any) {
    console.error('Admin authentication error:', error);
    return { error: error.message || 'පද්ධති දෝෂයක් (System configuration error)' };
  }
}

export async function getAdminLanterns(password: string) {
  const adminPass = getAdminPassword();
  if (password !== adminPass) {
    throw new Error('Unauthorized');
  }

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

export async function approveLantern(id: string, password: string) {
  try {
    const adminPass = getAdminPassword();
    if (password !== adminPass) {
      return { error: 'Unauthorized' };
    }

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

export async function rejectLantern(id: string, password: string) {
  try {
    const adminPass = getAdminPassword();
    if (password !== adminPass) {
      return { error: 'Unauthorized' };
    }

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

export async function selectWinner(id: string, password: string) {
  try {
    const adminPass = getAdminPassword();
    if (password !== adminPass) {
      return { error: 'Unauthorized' };
    }

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

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

    if (!creatorName || !title || !description || !videoUrl) {
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
    });

    await newLantern.save();
    
    revalidatePath('/');
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

    revalidatePath('/');
    return { success: true, likeCount: updatedLantern.likeCount };
  } catch (error: any) {
    console.error('Error liking lantern:', error);
    return { error: 'මනාපය පළකිරීමේදී දෝෂයක් ඇතිවිය (Error liking)' };
  }
}

export async function getAllLanterns() {
  try {
    await connectToDatabase();
    const lanterns = await Lantern.find()
      .sort({ likeCount: -1, createdAt: -1 })
      .lean();
    
    return JSON.parse(JSON.stringify(lanterns));
  } catch (error) {
    console.error('Error fetching lanterns:', error);
    return [];
  }
}

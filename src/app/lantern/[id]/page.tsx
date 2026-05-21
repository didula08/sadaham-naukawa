import connectToDatabase from '@/lib/mongodb';
import { Lantern } from '@/models/Lantern';
import LanternDetailsClient from '@/components/LanternDetailsClient';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LanternPage({ params }: PageProps) {
  const { id } = await params;

  // Validate the MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await connectToDatabase();
  const lanternDoc = await Lantern.findById(id).lean();

  if (!lanternDoc || (!lanternDoc.isApproved && !lanternDoc.isWinner)) {
    notFound();
  }

  // Get only approved lanterns sorted in the exact same order as the homepage
  const allLanterns = await Lantern.find({ isApproved: true }, '_id title').sort({ likeCount: -1, createdAt: -1 }).lean();
  const currentIndex = allLanterns.findIndex((item) => item._id.toString() === id);

  const prevLantern = currentIndex > 0 
    ? { id: allLanterns[currentIndex - 1]._id.toString(), title: allLanterns[currentIndex - 1].title } 
    : null;
  const nextLantern = currentIndex < allLanterns.length - 1 
    ? { id: allLanterns[currentIndex + 1]._id.toString(), title: allLanterns[currentIndex + 1].title } 
    : null;

  // Pass only safe fields to the Client Component (excludes banking/receipt details)
  const lantern = {
    _id: lanternDoc._id.toString(),
    title: lanternDoc.title,
    description: lanternDoc.description,
    videoUrl: lanternDoc.videoUrl,
    creatorName: lanternDoc.creatorName,
    likeCount: lanternDoc.likeCount,
    createdAt: lanternDoc.createdAt instanceof Date ? lanternDoc.createdAt.toISOString() : String(lanternDoc.createdAt),
    isWinner: lanternDoc.isWinner,
  };

  return (
    <LanternDetailsClient 
      lantern={lantern} 
      prevLantern={prevLantern} 
      nextLantern={nextLantern} 
    />
  );
}

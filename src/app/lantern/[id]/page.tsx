import connectToDatabase from '@/lib/mongodb';
import { Lantern } from '@/models/Lantern';
import LanternDetailsClient from '@/components/LanternDetailsClient';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';

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

  if (!lanternDoc) {
    notFound();
  }

  // Get all lanterns sorted in the exact same order as the homepage
  const allLanterns = await Lantern.find({}, '_id title').sort({ likeCount: -1, createdAt: -1 }).lean();
  const currentIndex = allLanterns.findIndex((item) => item._id.toString() === id);

  const prevLantern = currentIndex > 0 
    ? { id: allLanterns[currentIndex - 1]._id.toString(), title: allLanterns[currentIndex - 1].title } 
    : null;
  const nextLantern = currentIndex < allLanterns.length - 1 
    ? { id: allLanterns[currentIndex + 1]._id.toString(), title: allLanterns[currentIndex + 1].title } 
    : null;

  // Convert MongoDB Document to a plain JSON object to pass to Client Component
  const lantern = JSON.parse(JSON.stringify(lanternDoc));

  return (
    <LanternDetailsClient 
      lantern={lantern} 
      prevLantern={prevLantern} 
      nextLantern={nextLantern} 
    />
  );
}

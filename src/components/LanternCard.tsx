'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, PlayCircle, Sparkles } from 'lucide-react';

interface LanternCardProps {
  lantern: {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    creatorName: string;
    likeCount: number;
  };
}

export default function LanternCard({ lantern }: LanternCardProps) {
  const [isPlayingInline, setIsPlayingInline] = useState(false);

  // Extract YouTube ID for thumbnail and embedding
  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };
  
  const ytId = getYoutubeId(lantern.videoUrl);
  const thumbnailUrl = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
  const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : lantern.videoUrl;

  const isShorts = lantern.videoUrl.includes('shorts') || lantern.videoUrl.includes('/shorts/');
  const mediaAspectRatio = isShorts ? 'aspect-[3/4]' : 'aspect-video';

  return (
    <motion.div
      className="bg-[#0D0B0F]/90 border border-[#D4AF37]/20 rounded-3xl overflow-hidden hover:border-[#D4AF37]/70 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-500 group relative cursor-pointer flex flex-col h-full backdrop-blur-md"
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => {
        window.open(`/lantern/${lantern._id}`, '_blank');
      }}
    >
      {/* Immersive background glow in card */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/0 via-[#D4AF37]/2 to-[#D4AF37]/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
      
      {/* Creative Golden Sweep Shine Effect */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent pointer-events-none z-10" />

      {/* Video Preview Section */}
      <div className={`${mediaAspectRatio} w-full bg-black relative overflow-hidden flex-shrink-0 border-b border-[#D4AF37]/15 z-10`}>
        {isPlayingInline ? (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            title={lantern.title}
            className="w-full h-full absolute top-0 left-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : thumbnailUrl ? (
          <>
            <img 
              src={thumbnailUrl} 
              alt={lantern.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Play Button Hover Overlay */}
            <div 
              className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
              onClick={(e) => {
                e.stopPropagation(); // Stop click from opening the new window
                setIsPlayingInline(true);
              }}
            >
              <div className="p-3 bg-black/60 rounded-full border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black transition-all transform hover:scale-110 duration-300">
                <PlayCircle className="w-10 h-10 text-[#D4AF37] hover:text-black transition-colors" />
              </div>
              <span className="text-[#FFD700] text-xs font-bold mt-2 gold-text-glow bg-black/60 px-3 py-1 rounded-full border border-white/5">
                වීඩියෝව නරඹන්න (Play Video)
              </span>
            </div>
          </>
        ) : (
          <iframe
            src={embedUrl}
            title={lantern.title}
            className="w-full h-full absolute top-0 left-0 pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>

      {/* Details Section */}
      <div className="p-6 flex flex-col flex-grow relative z-10 justify-between gap-4">
        <div>
          {/* Creator Tag */}
          <div className="flex items-center gap-1.5 text-xs text-[#D4AF37]/80 mb-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>නිර්මාණය: {lantern.creatorName}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-extrabold text-[#FFD700] group-hover:text-[#FFF] transition-colors duration-300 line-clamp-2 leading-snug gold-text-glow">
            {lantern.title}
          </h3>
        </div>
        
        {/* Heart/Like counts footer */}
        <div className="flex justify-between items-center mt-2 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Heart className="w-4 h-4 fill-[#D4AF37]" />
            <span className="text-sm font-bold">{lantern.likeCount} පහන් (Lamps)</span>
          </div>
          
          <span className="text-xs text-[#D4AF37] opacity-60 group-hover:opacity-100 group-hover:underline transition-all">
            විස්තර බලන්න (View Details) &rarr;
          </span>
        </div>
      </div>
    </motion.div>
  );
}

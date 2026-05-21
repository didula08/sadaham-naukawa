'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, PlayCircle, Sparkles } from 'lucide-react';
import { getYoutubeId } from '@/lib/youtube';
import YouTubePlayer from '@/components/YouTubePlayer';

interface LanternCardProps {
  lantern: {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    creatorName: string;
    likeCount: number;
    isWinner?: boolean;
  };
}

export default function LanternCard({ lantern }: LanternCardProps) {
  const [isPlayingInline, setIsPlayingInline] = useState(false);

  const ytId = getYoutubeId(lantern.videoUrl);
  const thumbnailUrl = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
  const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : lantern.videoUrl;

  const mediaAspectRatio = 'aspect-video'; // Force uniform card sizes

  return (
    <motion.div
      className={`bg-gradient-to-b from-[#110E14]/95 to-[#070509]/95 rounded-3xl overflow-hidden hover:border-[#D4AF37]/75 transition-all duration-500 group relative cursor-pointer flex flex-col h-full backdrop-blur-lg ${
        lantern.isWinner 
          ? 'border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_35px_rgba(255,215,0,0.4)]' 
          : 'border border-[#D4AF37]/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]'
      }`}
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
          <YouTubePlayer
            videoId={ytId}
            embedUrl={embedUrl}
            title={lantern.title}
            autoplay={true}
          />
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
          <div className="flex items-center justify-between gap-1.5 text-xs mb-2 font-medium">
            <div className="flex items-center gap-1.5 text-[#D4AF37]/90 font-serif">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#FFD700]" />
              <span>නිර්මාණය: <strong className="text-white">{lantern.creatorName}</strong></span>
            </div>
            {lantern.isWinner && (
              <span className="flex items-center gap-1 bg-[#D4AF37] text-black px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow shadow-[#D4AF37]/50 font-sans">
                🏆 Winner
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-extrabold text-[#FFD700] group-hover:text-[#FFF] transition-colors duration-300 line-clamp-2 leading-snug gold-text-glow font-serif">
            {lantern.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#F5F5F7]/60 line-clamp-2 font-sans font-light leading-relaxed mt-2">
            {lantern.description}
          </p>
        </div>
        
        {/* Flame/Like counts footer */}
        <div className="flex justify-between items-center mt-2 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.08, 0.96, 1.08, 1],
                opacity: [0.8, 1, 0.75, 1, 0.8],
                filter: [
                  'drop-shadow(0 0 2px #FF6A00) drop-shadow(0 0 4px #FFD700)',
                  'drop-shadow(0 0 4px #FF6A00) drop-shadow(0 0 8px #FFD700)',
                  'drop-shadow(0 0 2px #FF6A00) drop-shadow(0 0 4px #FFD700)',
                  'drop-shadow(0 0 5px #FF6A00) drop-shadow(0 0 10px #FFD700)',
                  'drop-shadow(0 0 2px #FF6A00) drop-shadow(0 0 4px #FFD700)',
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative flex items-center justify-center"
            >
              <Flame className="w-5 h-5 text-[#FF6A00] fill-[#FF6A00]" />
              <Flame className="w-5 h-5 text-[#FFCC00] fill-[#FFCC00] absolute animate-ping opacity-25" />
            </motion.div>
            <span className="text-sm font-extrabold text-white">
              {lantern.likeCount} <span className="text-[#FFD700] text-xs font-serif font-semibold">පහන් (Lamps)</span>
            </span>
          </div>
          
          <span className="text-xs text-[#D4AF37] font-semibold group-hover:underline transition-all">
            විස්තර බලන්න &rarr;
          </span>
        </div>
      </div>
    </motion.div>
  );
}
